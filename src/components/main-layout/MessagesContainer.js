import React, { Component } from 'react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Message from './Message';
import MessagesList from './MessagesList';
import Uploader from './FileUpload';

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
	state = {
		hasMoreItems: true,
	};

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
					messages: [subscriptionData.data.newChannelMessage, ...prev.messages],
				};
			},
		});

	render() {
		const { data: { loading, messages, fetchMore }, channelId } = this.props;
		if (loading) {
			return null;
		}
		return (
  <MessageContainer>
    {/* {this.state.hasMoreItems && (
    <button
      onClick={() => {
							fetchMore({
								variables: {
									channelId,
									cursor: messages[messages.length - 1].created_at,
								},
								updateQuery: (previousResult, { fetchMoreResult }) => {
									if (!fetchMoreResult) {
										return previousResult;
									}

									if (fetchMoreResult.messages.length < 30) {
										this.setState({ hasMoreItems: false });
									}

									return {
										...previousResult,
										messages: [
											...previousResult.messages,
											...fetchMoreResult.messages,
										],
									};
								},
							});
						}}
    >
						Load more
    </button>
				)} */}
    <Uploader disableClick>
      <MessagesList>
        {[...messages]
							.reverse()
							.map(message => <Message key={message.id} message={message} />)}
      </MessagesList>
    </Uploader>
  </MessageContainer>
		);
	}
}

const messagesQuery = gql`
	query($cursor: String, $channelId: Int!) {
		messages(cursor: $cursor, channelId: $channelId) {
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
	options: props => ({
		fetchPolicy: 'network-only',
		variables: {
			channelId: props.channelId,
		},
	}),
})(MessagesContainer);
