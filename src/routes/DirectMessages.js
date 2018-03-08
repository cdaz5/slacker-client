import React from 'react';
import findIndex from 'lodash/findIndex';
import { Redirect } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import MainContainer from '../components/main-layout/MainContainer';
import { meQuery } from '../graphql/Team';
import Header from '../components/main-layout/Header';
import DirectMessageContainer from '../containers/DirectMessageContainer';
import TextContainer from '../components/main-layout/TextContainer';
import Sidebar from '../containers/Sidebar';

const ViewTeam = ({ mutate, data: { loading, me }, match: { params: { teamId, userId } } }) => {
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

	return (
  <MainContainer>
    <Sidebar
      teams={teams.map(team => ({
					id: team.id,
					letter: team.name.charAt(0).toUpperCase(),
				}))}
      team={currentTeam}
      userName={username}
    />
    <Header channelName="a username" />
    <DirectMessageContainer teamId={teamId} userId={userId} />
    <TextContainer
      onSubmit={async (text) => {
					const response = await mutate({
						variables: {
							text,
							receiverId: userId,
							teamId,
						},
					});
					console.log(response);
				}}
      placeholder={userId}
    />
  </MainContainer>
	);
};

const createDirectMessageMutation = gql`
	mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
		createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
	}
`;
// export default ViewTeam;
export default compose(
	graphql(createDirectMessageMutation),
	graphql(meQuery, { options: { fetchPolicy: 'network-only' } }),
)(ViewTeam);
