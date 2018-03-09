import React from 'react';
import { Comment } from 'semantic-ui-react';
import styled from 'styled-components';

const Message = styled.div`
	display: flex;
	align-items: center;
	padding: 0.2em;
	color: #000;
`;

const Avatar = styled.div`
	align-self: ${props => (!props.gif ? 'flex-start' : 'center')};
`;

export default ({ message }) => {
	const pattern = new RegExp(/jpg|gif|png|gph/gi);
	return (
  <Message>
    <div style={{ alignSelf: 'flex-start' }}>
      <img
        alt="placeholder-avatar"
        src="https://png.icons8.com/ios/50/000000/anonymous-mask.png"
      />
    </div>
    <div>
      <div style={{ display: 'flex' }}>
        <Comment.Author style={{ paddingRight: '5px' }}>
          {message.user.username}
        </Comment.Author>
        <Comment.Metadata>{message.created_at}</Comment.Metadata>
      </div>
      <Comment.Text>
        {pattern.test(message.text) ? (
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={message.text} target="_blank">
              {message.text}
            </a>
            <span>
              <img style={{ maxHeight: '272px' }} alt={message.id} src={message.text} />
            </span>
          </span>
					) : (
						message.text
					)}
      </Comment.Text>
    </div>
  </Message>
	);
};
