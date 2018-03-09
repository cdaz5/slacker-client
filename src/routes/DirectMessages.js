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

const ViewTeam = ({
	mutate,
	data: { loading, me, getUser },
	match: { params: { teamId, userId } },
}) => {
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
    <Header channelName={getUser.username} />
    <DirectMessageContainer teamId={currentTeam.id} userId={userId} />
    <TextContainer
      onSubmit={async (text) => {
					const response = await mutate({
						variables: {
							text,
							receiverId: userId,
							teamId,
						},
						optimisticResponse: {
							createDirectMessage: true,
						},
						update: (store) => {
							const data = store.readQuery({ query: meQuery });
							const teamIdx2 = findIndex(data.me.teams, ['id', currentTeam.id]);
							const userPresent = data.me.teams[teamIdx2].directMessageMembers.every(member => member.id !== parseInt(userId, 10));

							if (userPresent) {
								data.me.teams[teamIdx2].directMessageMembers.push({
									__typename: 'User',
									id: userId,
									username: getUser.username,
								});
								store.writeQuery({ query: meQuery, data });
							}
						},
					});
					console.log(response);
				}}
      placeholder={getUser.username}
    />
  </MainContainer>
	);
};

const createDirectMessageMutation = gql`
	mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
		createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
	}
`;

const directMessageMeQuery = gql`
	query($userId: Int!) {
		getUser(userId: $userId) {
			username
		}
		me {
			id
			username
			email
			teams {
				id
				name
				admin
				directMessageMembers {
					id
					username
				}
				channels {
					id
					name
				}
			}
		}
	}
`;
// export default ViewTeam;
export default compose(
	graphql(createDirectMessageMutation),
	graphql(directMessageMeQuery, {
		options: props => ({
			variables: { userId: props.match.params.userId },
			fetchPolicy: 'network-only',
		}),
	}),
)(ViewTeam);
