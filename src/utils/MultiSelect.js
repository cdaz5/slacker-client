import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { graphql } from 'react-apollo';

import { getTeamMembersQuery } from '../graphql/Team';

// stateOptions = [ { key: 'AL', value: 'AL', text: 'Alabama' }, ...  ]

const MultiSelect = ({
	data: { loading, getTeamMembers },
	teamId,
	value,
	handleChange,
	placeholder,
}) =>
	(console.log(teamId) || loading ? null : (
  <Dropdown
    placeholder={placeholder}
    onChange={handleChange}
    value={value}
    fluid
    multiple
    search
    selection
    options={getTeamMembers.map(member => ({
				key: member.id,
				value: member.id,
				text: member.username,
			}))}
		/>
	));

export default graphql(getTeamMembersQuery, {
	options: props => ({
		variables: { teamId: props.teamId },
	}),
})(MultiSelect);
