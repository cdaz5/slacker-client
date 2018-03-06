import React from 'react';
import styled from 'styled-components';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';

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

const MessagesContainer = ({ data: { loading, messages } }) => {
	if (loading) {
		return null;
	}
	return (
  <MessageContainer>
    <MessagesList>{messages.map(message => <Message message={message} />)}</MessagesList>
  </MessageContainer>
	);
};

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
})(MessagesContainer);
