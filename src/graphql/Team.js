/*eslint-disable */
import gql from 'graphql-tag';

export const meQuery = gql`
	{
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
					dm
					public
				}
			}
		}
	}
`;

export const getTeamMembersQuery = gql`
	query($teamId: Int!) {
		getTeamMembers(teamId: $teamId) {
			id
			username
		}
	}
`;
