import React from 'react';
import { Modal, Popup, Input } from 'semantic-ui-react';

import Button from '../buttons/Button';

const InvitePeopleModal = ({
	isOpen,
	handleInvitePeopleModal,
	handleInvitePeopleChange,
	handleInvitePeopleSubmit,
	values,
	teamId,
	errors,
}) => (
  <Modal open={isOpen}>
    <Modal.Header>Invite A Member</Modal.Header>
    <Modal.Content>
      <form onSubmit={event => event.preventDefault()}>
        <Popup
          inverted
          trigger={
            <Input
              onChange={handleInvitePeopleChange}
              value={values.email}
              name="email"
              error={!!errors.email}
              size="huge"
              action={{ icon: 'mail outline', size: 'huge' }}
              actionPosition="left"
              placeholder="Enter an email..."
              style={{ padding: '15px 0', width: '100%' }}
            />
					}
          content={errors.email}
          open={!!errors.email}
          position="right center"
        />
      </form>
    </Modal.Content>
    <div>
      <Button onClick={handleInvitePeopleModal}>Cancel</Button>
      <Button primary onClick={() => handleInvitePeopleSubmit(teamId)}>
				Add Member
      </Button>
    </div>
  </Modal>
);

export default InvitePeopleModal;
