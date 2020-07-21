import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import client from './config/apollo';
import {ApolloProvider} from '@apollo/client';
import React from 'react';
const upTaskApp = () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};
AppRegistry.registerComponent(appName, () => upTaskApp);
