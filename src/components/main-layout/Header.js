import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
	grid-column: 3;
	grid-row: 1;
	color: #2c2d30;
	padding: 1em;
`;

export default ({ channelName }) => <Header>{`#${channelName}`}</Header>;
