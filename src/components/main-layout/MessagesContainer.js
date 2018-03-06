import React, { Component } from 'react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Message from './Message';
import MessagesList from './MessagesList';

const MessageContainer = styled.div`
	grid-column: 3;
	grid-row: 2;
	color: #fff;
	padding: 1em;
	display: flex;
	flex-direction: column-reverse;
	overflow-y: auto;
`;

const newChannelMessageSubscription = gql`
	subscription($channelId: Int!) {
		newChannelMessage(channelId: $channelId) {
			id
			text
			user {
				username
			}
			created_at
		}
	}
`;

class MessagesContainer extends Component {
	componentWillMount() {
		this.unsubscribe = this.subscribe(this.props.channelId);
	}

	componentWillReceiveProps({ channelId }) {
		if (this.props.channelId !== channelId) {
			if (this.unsubscribe) {
				this.unsubscribe();
			}
			this.unsubscribe = this.subscribe(channelId);
		}
	}

	componentWillUnmount() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	subscribe = channelId =>
		this.props.data.subscribeToMore({
			document: newChannelMessageSubscription,
			variables: {
				channelId,
			},
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) {
					return prev;
				}

				return {
					...prev,
					messages: [...prev.messages, subscriptionData.data.newChannelMessage],
				};
			},
		});

	render() {
		const { data: { loading, messages } } = this.props;
		if (loading) {
			return null;
		}
		return (
  <MessageContainer>
    <MessagesList>
      {messages.map(message => <Message key={message.id} message={message} />)}
    </MessagesList>
  </MessageContainer>
		);
	}
}

const messagesQuery = gql`
	query($channelId: Int!) {
		messages(channelId: $channelId) {
			id
			text
			user {
				username
			}
			created_at
		}
	}
`;

export default graphql(messagesQuery, {
	variables: props => ({
		channelId: props.channelId,
	}),
	options: {
		fetchPolicy: 'network-only',
	},
})(MessagesContainer);
