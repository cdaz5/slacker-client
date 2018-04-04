import React from 'react';
import { Comment } from 'semantic-ui-react';
import styled from 'styled-components';
import moment from 'moment';

import mask from '../../images/anonymous-mask.png';
import PlaceholderAvatars from '../../utils/PlaceholderAvatars';

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
	const randomNumber = () => Math.floor(Math.random() * PlaceholderAvatars.length);

	const pattern = new RegExp(/jpg|gif|png|gph/gi);
	return (
  <Message>
    <div style={{ alignSelf: 'flex-start' }}>
      <img alt="placeholder-avatar" src={PlaceholderAvatars[randomNumber()]} />
    </div>
    <div style={{ marginLeft: '10px' }}>
      <div style={{ display: 'flex' }}>
        <Comment.Author style={{ paddingRight: '5px' }}>
          {message.user.username}
        </Comment.Author>
        <Comment.Metadata>{moment(message.created_at).format(`ddd M/D h:mm a`)}</Comment.Metadata>
      </div>
      <Comment.Text>
        {pattern.test(message.text) ? (
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={message.text} target="_blank">
              {message.text}
            </a>
            <span>
              <img
                style={{ maxHeight: '272px' }}
                alt={message.id}
                src={message.text}
              />
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

