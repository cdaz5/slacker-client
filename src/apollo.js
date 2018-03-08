import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { ApolloLink, split } from 'apollo-link';

const httpLink = createHttpLink({ uri: 'http://localhost:3000/graphql' });

const middlewareLink = setContext(() => ({
	headers: {
		'x-token': localStorage.getItem('token'),
		'x-refresh-token': localStorage.getItem('refreshToken'),
	},
}));

const afterwareLink = new ApolloLink((operation, forward) =>
	forward(operation).map((response) => {
		const { response: { headers } } = operation.getContext();

		if (headers) {
			const token = headers.get('x-token');
			const refreshToken = headers.get('x-refresh-token');
			if (token) {
				localStorage.setItem('token', token);
			}
			if (refreshToken) {
				localStorage.setItem('refreshToken', refreshToken);
			}
		}
		return response;
	}));

// use with apollo-client
const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink));

// Create a WebSocket link:
const wsLink = new WebSocketLink({
	uri: 'ws://localhost:3000/subscriptions',
	options: {
		reconnect: true,
		connectionParams: {
			token: localStorage.getItem('token'),
			refreshToken: localStorage.getItem('refreshToken'),
		},
	},
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
	// split based on operation type
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsLink,
	httpLinkWithMiddleware,
);

export default new ApolloClient({
	link,
	cache: new InMemoryCache(),
});
