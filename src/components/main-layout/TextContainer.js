import React from 'react';
import styled from 'styled-components';
import Input from '../inputs/Input';

const TextContainer = styled.div`
	grid-column: 3;
	grid-row: 3;
	color: #fff;
	padding: 1em;
	text-align: center;
`;

export default ({ channelName }) => (
  <TextContainer>
    <Input placeholder={`Message #${channelName}`} />
  </TextContainer>
);
