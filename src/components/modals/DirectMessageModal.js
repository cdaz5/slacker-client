import React from 'react';
import { Modal, Popup, Icon } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import findIndex from 'lodash/findIndex';

import Button from '../buttons/Button';
import { meQuery } from '../../graphql/Team';
import MultiSelect from '../../utils/MultiSelect';

const DirectMessageModal = ({
	isOpen,
	handleDirectMessageModal,
	teamId,
	currentUserId,
	values,
	handleSubmit,
	isSubmitting,
	resetForm,
	setFieldValue,
}) => (
  <Modal size='small' open={isOpen}>
    <div
      style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '10px',
			}}
    >
      <div style={{ alignSelf: 'flex-end' }}>
        <Icon style={{ cursor: 'pointer' }} onClick={handleDirectMessageModal} size="big" name="close" />
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
				Direct Messages
      </div>
    </div>
    <Modal.Content>
      <form style={{ display: 'flex'}} onSubmit={event => event.preventDefault()}>
        <Popup
          inverted
          trigger={
            <MultiSelect
              currentUserId={currentUserId}
              teamId={teamId}
              placeholder="Search by name"
              value={values.members}
              handleChange={(event, { value }) => setFieldValue('members', value)}
            />
					}
					// content={errors.email}
					// open={!!errors.email}
          position="right center"
        />
        <Button invite DM disabled={isSubmitting} onClick={handleSubmit}>
          Go
        </Button>
      </form>
    </Modal.Content>
  </Modal>
);

const getOrCreateChannelMutation = gql`
	mutation($teamId: Int!, $members: [Int!]!) {
		getOrCreateChannel(teamId: $teamId, members: $members) {
      id
      name
      channel {
        id
        name
        dm
        public
      }
    }
	}
`;

export default compose(
	withRouter,
	graphql(getOrCreateChannelMutation),
	withFormik({
		mapPropsToValues: () => ({ members: [] }),
		handleSubmit: async ({ members }, { props: { history, handleDirectMessageModal, teamId, mutate }, resetForm }) => {
      //debugger
			const response = await mutate({
				variables: {
					teamId,
					members,
        },
        update: (store, { data: { getOrCreateChannel } }) => {
          console.log('getOrCreateChannel', getOrCreateChannel)
          const { id, name, channel } = getOrCreateChannel;

          const data = store.readQuery({ query: meQuery });
          console.log('before write data', data)
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          const notInChannelList = data.me.teams[teamIdx].channels.every(c => c.id !== id);

          if (notInChannelList) {
            data.me.teams[teamIdx].channels.push(channel);
            console.log('after push data', data)
            store.writeQuery({ query: meQuery, data });
          }
          history.push(`/view-team/${teamId}/${channel.id}`);
        },
			});
			console.log(response);
      resetForm();
      handleDirectMessageModal();
		},
	}),
)(DirectMessageModal);
