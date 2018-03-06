import gql from 'graphql-tag';

export const allTeamsQuery = gql`
	{
		allTeams {
			name
			id
			channels {
				id
				name
			}
		}
	}
`;
