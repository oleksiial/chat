const express = require('express');
const cookieParser = require('cookie-parser');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');

const { resolvers } = require('./resolvers.js');
const { typeDefs } = require('./schema.gql');

const { exchangeSessionId } = require('./api/auth');
const { getConversationsByUserId } = require('./db/conversations')

const PORT = process.env.PORT || 4000;
const corsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true
};

const app = express();
app.use(cookieParser());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res, connection }) => {
    const sessionId = req ? req.cookies.sid : connection.variables.sid;
    let currentUser = null;
    if (sessionId) {
      try {
        currentUser = await exchangeSessionId(sessionId);
      } catch (e) {
        console.warn(`Unable to authenticate using session id: ${sessionId}`, e.message);
      }
    }

    return {
      sessionId,
      currentUser,
      res
    };
  }
});
apolloServer.applyMiddleware({ app, cors: corsOptions });

const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  console.log(`Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
});
