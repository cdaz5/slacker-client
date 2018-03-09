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

const newDirectMessageSubscription = gql`
	subscription($teamId: Int!, $userId: Int!) {
		newDirectMessage(teamId: $teamId, userId: $userId) {
			id
			text
			sender {
				username
			}
			created_at
		}
	}
`;

class DirectMessagesContainer extends Component {
	componentWillMount() {
		this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
	}

	componentWillReceiveProps({ teamId, userId }) {
		if (this.props.teamId !== teamId || this.props.userId !== userId) {
			if (this.unsubscribe) {
				this.unsubscribe();
			}
			this.unsubscribe = this.subscribe(teamId, userId);
		}
	}

	componentWillUnmount() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	subscribe = (teamId, userId) =>
		this.props.data.subscribeToMore({
			document: newDirectMessageSubscription,
			variables: {
				teamId,
				userId,
			},
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) {
					return prev;
				}

				return {
					...prev,
					directMessages: [
						...prev.directMessages,
						subscriptionData.data.newDirectMessage,
					],
				};
			},
		});

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
	options: props => ({
		variables: {
			teamId: props.teamId,
			userId: props.userId,
		},
		fetchPolicy: 'network-only',
	}),
})(DirectMessagesContainer);
