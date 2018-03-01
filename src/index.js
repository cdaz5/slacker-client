import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import 'semantic-ui-css/semantic.min.css';

import registerServiceWorker from './registerServiceWorker';
import Routes from './routes';

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({ uri: 'http://localhost:3000/graphql' });

const App = (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(App, document.getElementById('root'));
registerServiceWorker();
