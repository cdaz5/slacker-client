import React from 'react';
import { Comment } from 'semantic-ui-react';
import styled from 'styled-components';

const Message = styled.div`
	display: flex;
	align-items: center;
	padding: 0.2em;
	color: #000;
`;

export default ({ message }) => (
  <Message>
    <div>
      <img src="https://png.icons8.com/ios/50/000000/anonymous-mask.png" />
    </div>
    <div>
      <div style={{ display: 'flex' }}>
        <Comment.Author style={{ paddingRight: '5px' }}>
          {message.user.username}
        </Comment.Author>
        <Comment.Metadata>{message.created_at}</Comment.Metadata>
      </div>
      <Comment.Text>{message.text}</Comment.Text>
    </div>
  </Message>
);
