import React from 'react';
import { Modal, Popup, Input } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import Button from '../buttons/Button';
import { getTeamMembersQuery } from '../../graphql/Team';
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
  <Modal open={isOpen}>
    <Modal.Header>Select a Photo</Modal.Header>
    <Modal.Content>
      <form onSubmit={event => event.preventDefault()}>
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
      </form>
    </Modal.Content>
    <div>
      <Button
        disabled={isSubmitting}
        onClick={(event) => {
					handleDirectMessageModal();
					resetForm();
				}}
      >
				Cancel
      </Button>
      <Button disabled={isSubmitting} onClick={handleSubmit}>
				Create
      </Button>
    </div>
  </Modal>
);

const getOrCreateChannelMutation = gql`
	mutation($teamId: Int!, $members: [Int!]!) {
		getOrCreateChannel(teamId: $teamId, members: $members)
	}
`;

export default compose(
	withRouter,
	graphql(getOrCreateChannelMutation),
	withFormik({
		mapPropsToValues: () => ({ members: [] }),
		handleSubmit: async ({ members }, { props: { onClose, teamId, mutate }, setSubmitting }) => {
      //debugger
			const response = await mutate({
				variables: {
					teamId,
					members,
				},
			});
			console.log(response);
			setSubmitting(false);
			// await mutate({
			//   variables: {
			//     teamId,
			//     name: values.name,
			//     public: values.public,
			//     members: values.members,
			//   },
			//   optimisticResponse: {
			//     createChannel: {
			//       __typename: 'Mutation',
			//       ok: true,
			//       channel: {
			//         __typename: 'Channel'
			//       }
			//     }
			//   }
			// })
		},
	}),
)(DirectMessageModal);
