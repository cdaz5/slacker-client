import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import MainContainer from '../components/main-layout/MainContainer';
import { allTeamsQuery } from '../graphql/Team';
import Header from '../components/main-layout/Header';
import MessagesContainer from '../components/main-layout/MessagesContainer';
import TextContainer from '../components/main-layout/TextContainer';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({
	data: { loading, allTeams, inviteTeams },
	match: { params: { teamId, channelId } },
}) => {
	if (loading) {
		return null;
	}

	const teams = [...allTeams, ...inviteTeams];

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
    />
    {currentChannel && [
      <Header key="channel-header" channelName={currentChannel.name} />,
      <MessagesContainer key="channel-messages" channelId={currentChannel.id} />,
      <TextContainer
        key="channel-text"
        channelId={currentChannel.id}
        channelName={currentChannel.name}
      />,
			]}
  </MainContainer>
	);
};

// export default ViewTeam;
export default graphql(allTeamsQuery)(ViewTeam);
