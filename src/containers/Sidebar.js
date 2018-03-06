import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';
import jwtDecode from 'jwt-decode';

import TeamsContainer from '../components/main-layout/TeamsContainer';
import ChannelsContainer from '../components/main-layout/ChannelsContainer';
import CreateChannelModal from '../components/modals/CreateChannelModal';
import InvitePeopleModal from '../components/modals/InvitePeopleModal';
import { allTeamsQuery } from '../graphql/Team';

class Sidebar extends Component {
	state = {
		showModal: false,
		inviteModal: false,
		channelName: '',
		public: true,
		email: '',
		errors: {
			email: '',
		},
	};

	handleClearErrors = () => {
		this.setState({
			...this.state,
			errors: {
				email: '',
			},
		});
	};

	handleCreateChannelModal = () => {
		this.setState(prevState => ({
			showModal: !prevState.showModal,
		}));
	};

	handleInvitePeopleModal = () => {
		this.setState(prevState => ({
			inviteModal: !prevState.inviteModal,
		}));
	};

	handleInvitePeopleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleInvitePeopleSubmit = async (teamId) => {
		const { email } = this.state;
		const response = await this.props.AddTeamMemberMutation({
			variables: {
				email,
				teamId,
			},
		});
		console.log(response);
		const { ok, errors } = response.data.addTeamMember;
		if (ok) {
			this.handleInvitePeopleModal();
		} else if (!ok) {
			const errs = {};
			errors.forEach(err => (errs[`${err.path}`] = err.message));
			return this.setState({
				...this.state,
				errors: {
					...this.state.errors,
					...errs,
				},
			});
		}
	};

	handleCreateChannelSubmit = async (teamId) => {
		const { channelName } = this.state;
		const response = await this.props.createChannelMutation({
			variables: {
				name: channelName,
				teamId,
			},
			optimisticResponse: {
				createChannel: {
					__typename: 'Mutation',
					ok: true,
					channel: {
						__typename: 'Channel',
						id: -1,
						name: channelName,
					},
				},
			},
			update: (store, { data: { createChannel } }) => {
				const { ok, channel, errors } = createChannel;
				if (!ok) {
					return;
				}
				const data = store.readQuery({ query: allTeamsQuery });
				const teamIdx = findIndex(data.allTeams, ['id', teamId]);
				data.allTeams[teamIdx].channels.push(channel);
				store.writeQuery({ query: allTeamsQuery, data });
			},
		});
		this.handleCreateChannelModal();
	};

	handleCreateChannelChange = (event, data) => {
		if (data.name === 'public') {
			return this.setState({
				[data.name]: data.checked,
			});
		}
		return this.setState({
			[event.target.name]: event.target.value,
		});
	};

	render() {
		const { teams, team, currentChannelId } = this.props;
		const { showModal, inviteModal, errors } = this.state;

		let userName = '';
		let isOwner = false;
		try {
			const token = localStorage.getItem('token');
			const { user } = jwtDecode(token);
			userName = user.username;
			isOwner = user.id === team.owner;
		} catch (err) {
			/* eslint-disable-next-line no-console */
			console.log(err);
		}
		return [
  <CreateChannelModal
    key="create-channel-modal"
    isOpen={showModal}
    handleCreateChannelModal={this.handleCreateChannelModal}
    handleCreateChannelChange={this.handleCreateChannelChange}
    handleCreateChannelSubmit={this.handleCreateChannelSubmit}
    teamId={team.id}
    values={this.state}
  />,
  <InvitePeopleModal
    errors={errors}
    key="invite-people-modal"
    isOpen={inviteModal}
    teamId={team.id}
    values={this.state}
    handleInvitePeopleModal={this.handleInvitePeopleModal}
    handleInvitePeopleSubmit={this.handleInvitePeopleSubmit}
    handleInvitePeopleChange={this.handleInvitePeopleChange}
  />,
  <TeamsContainer key="team-sidebar" teams={teams} />,
  <ChannelsContainer
    key="channels-sidebar"
    currentChannelId={currentChannelId}
    teamName={team.name}
    teamId={team.id}
    isOwner={isOwner}
    userName={userName}
    channels={team.channels}
    users={[{ id: 1, name: 'arkell' }, { id: 2, name: 'cdaz' }]}
    handleCreateChannelModal={this.handleCreateChannelModal}
    handleInvitePeopleModal={this.handleInvitePeopleModal}
  />,
		];
	}
}

const createChannelMutation = gql`
	mutation($teamId: Int!, $name: String!) {
		createChannel(teamId: $teamId, name: $name) {
			ok
			channel {
				id
				name
			}
		}
	}
`;

const AddTeamMemberMutation = gql`
	mutation($email: String!, $teamId: Int!) {
		addTeamMember(email: $email, teamId: $teamId) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default compose(
	graphql(createChannelMutation, {
		name: 'createChannelMutation',
	}),
	graphql(AddTeamMemberMutation, {
		name: 'AddTeamMemberMutation',
	}),
)(Sidebar);
