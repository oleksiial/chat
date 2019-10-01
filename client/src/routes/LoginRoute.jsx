import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';

import { AUTH_DATA } from '../requests';

const LoginRoute = ({ path, render }) => {
  const client = useApolloClient();
  const { authData: { isLoggedIn } } = client.readQuery({ query: AUTH_DATA });

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return <Route path={path} render={render} />;
};

export default LoginRoute;
