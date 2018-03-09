import React from 'react';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';

import MainContainer from '../components/main-layout/MainContainer';
import { meQuery } from '../graphql/Team';
import Header from '../components/main-layout/Header';
import MessagesContainer from '../components/main-layout/MessagesContainer';
import TextContainer from '../components/main-layout/TextContainer';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ mutate, data: { loading, me }, match: { params: { teamId, channelId } } }) => {
	if (loading) {
		return null;
	}
	const { teams, username } = me;

	if (teams.length < 1) {
		return <Redirect to="/create-team" />;
	}

	console.log('teams', teams);
	const teamIdInteger = parseInt(teamId, 10);
	const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
	const currentTeam = teamIdx === -1 ? teams[0] : teams[teamIdx];

	const channelIdInteger = parseInt(channelId, 10);
	const channelIdx = channelIdInteger
		? findIndex(currentTeam.channels, ['id', channelIdInteger])
		: 0;
	const currentChannel =
		channelIdx === -1 ? currentTeam.channels[0] : currentTeam.channels[channelIdx];

	console.log(currentTeam.directMessageMembers);
	return (
  <MainContainer>
    <Sidebar
      currentChannelId={currentChannel.id}
      currentTeamId={teamId}
      teams={teams.map(team => ({
					id: team.id,
					letter: team.name.charAt(0).toUpperCase(),
				}))}
      team={currentTeam}
      userName={username}
    />
    {currentChannel && [
      <Header key="channel-header" channelName={currentChannel.name} />,
      <MessagesContainer key="channel-group-messages" channelId={currentChannel.id} />,
      <TextContainer
        key="channel-messages"
        onSubmit={async (text) => {
						await mutate({ variables: { channelId: currentChannel.id, text } });
					}}
        placeholder={currentChannel.name}
      />,
			]}
  </MainContainer>
	);
};

const createMessageMutation = gql`
	mutation($channelId: Int!, $text: String!) {
		createMessage(channelId: $channelId, text: $text)
	}
`;
// export default ViewTeam;
export default compose(
	graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
	graphql(createMessageMutation),
)(ViewTeam);
