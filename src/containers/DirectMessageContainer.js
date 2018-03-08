import React, { Component } from 'react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import DirectMessage from '../components/main-layout/DirectMessage';
import MessagesList from '../components/main-layout/MessagesList';

const MessageContainer = styled.div`
	grid-column: 3;
	grid-row: 2;
	color: #fff;
	padding: 1em;
	display: flex;
	flex-direction: column-reverse;
	overflow-y: auto;
`;

// const newChannelMessageSubscription = gql`
// 	subscription($channelId: Int!) {
// 		newChannelMessage(channelId: $channelId) {
// 			id
// 			text
// 			user {
// 				username
// 			}
// 			created_at
// 		}
// 	}
// `;

class DirectMessagesContainer extends Component {
	// componentWillMount() {
	// 	this.unsubscribe = this.subscribe(this.props.channelId);
	// }

	// componentWillReceiveProps({ channelId }) {
	// 	if (this.props.channelId !== channelId) {
	// 		if (this.unsubscribe) {
	// 			this.unsubscribe();
	// 		}
	// 		this.unsubscribe = this.subscribe(channelId);
	// 	}
	// }

	// componentWillUnmount() {
	// 	if (this.unsubscribe) {
	// 		this.unsubscribe();
	// 	}
	// }

	// subscribe = channelId =>
	// 	this.props.data.subscribeToMore({
	// 		document: newChannelMessageSubscription,
	// 		variables: {
	// 			channelId,
	// 		},
	// 		updateQuery: (prev, { subscriptionData }) => {
	// 			if (!subscriptionData.data) {
	// 				return prev;
	// 			}

	// 			return {
	// 				...prev,
	// 				messages: [...prev.messages, subscriptionData.data.newChannelMessage],
	// 			};
	// 		},
	// 	});

	render() {
		console.log(this.props);
		const { data: { loading, directMessages }, userId } = this.props;
		if (loading) {
			return null;
		}
		return (
  <MessageContainer>
    <MessagesList>
      {directMessages.map(message => (
        <DirectMessage key={message.id} message={message} />
					))}
    </MessagesList>
  </MessageContainer>
		);
	}
}

const directMessagesQuery = gql`
	query($teamId: Int!, $userId: Int!) {
		directMessages(teamId: $teamId, otherUserId: $userId) {
			id
			text
			sender {
				username
			}
			created_at
		}
	}
`;

export default graphql(directMessagesQuery, {
	variables: props => ({
		teamId: props.teamId,
		userId: props.userId,
	}),
	options: {
		fetchPolicy: 'network-only',
	},
})(DirectMessagesContainer);
