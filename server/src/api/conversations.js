const { createConversation, checkParticipant } = require('../db/conversations');
const { joinConversation } = require('../db/users');
const { createMessage } = require('../db/messages');

const startConversation = async (userId1, userId2) => {
  const conversation = await createConversation(1, null); // typeId = 1 : private, label is null
  await Promise.all([
    joinConversation(userId1, conversation.id),
    joinConversation(userId2, conversation.id)
  ]);
  return conversation;
};

const createGroup = async (ownerId, label) => {
  const conversation = await createConversation(2, label); // typeId = 1 : private, label is null
  await joinConversation(ownerId, conversation.id);
  return conversation;
};

const sendMessage = async (userId, conversationId, text) => {
  if (!checkParticipant(userId, conversationId)) {
    throw new Error('User is not a participant of the conversation');
  }
  const message = await createMessage(userId, conversationId, text);
  return message;
};

module.exports = {
  startConversation,
  createGroup,
  sendMessage
};
