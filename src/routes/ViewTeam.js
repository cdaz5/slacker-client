import React from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';

import MainContainer from '../components/main-layout/MainContainer';
import { allTeamsQuery } from '../graphql/Team';
import Header from '../components/main-layout/Header';
import MessagesContainer from '../components/main-layout/MessagesContainer';
import TextContainer from '../components/main-layout/TextContainer';
import Message from '../components/main-layout/Message';
import MessagesList from '../components/main-layout/MessagesList';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ data: { loading, allTeams }, match: { params: { teamId, channelId } } }) => {
	if (loading) {
		return null;
	}

	if (allTeams.length < 1) {
		return <Redirect to="/create-team" />;
	}

	const teamIdInteger = parseInt(teamId, 10);
	const teamidx = teamIdInteger ? findIndex(allTeams, ['id', teamIdInteger]) : 0;
	const currentTeam = allTeams[teamidx];

	const channelIdInteger = parseInt(channelId, 10);
	const channelIdx = channelIdInteger
		? findIndex(currentTeam.channels, ['id', channelIdInteger])
		: 0;
	const currentChannel = currentTeam.channels[channelIdx];
	return (
  <MainContainer>
    <Sidebar
      currentChannelId={currentChannel.id}
      currentTeamId={teamId}
      teams={allTeams.map(team => ({
					id: team.id,
					letter: team.name.charAt(0).toUpperCase(),
				}))}
      team={currentTeam}
    />
    {currentChannel && [
      <Header key='channel-header' channelName={currentChannel.name} />,
      <MessagesContainer key='channel-messages' channelId={currentChannel.id}>
        <MessagesList>
          <Message>text</Message>
          <Message>text</Message>
        </MessagesList>
      </MessagesContainer>,
      <TextContainer key='channel-text' channelName={currentChannel.name} />
    ]}
  </MainContainer>
	);
};

// export default ViewTeam;
export default graphql(allTeamsQuery)(ViewTeam);
