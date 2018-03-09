import React from 'react';
import { Modal, Popup, Input, Icon } from 'semantic-ui-react';

import Button from '../buttons/Button';

const InvitePeopleModal = ({
	isOpen,
	handleInvitePeopleModal,
	handleInvitePeopleChange,
	handleInvitePeopleSubmit,
	values,
	teamId,
	errors,
	teamName,
}) => (
  <Modal size='tiny' open={isOpen}>
    <div
      style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '10px',
			}}
    >
      <div style={{ alignSelf: 'flex-end' }}>
        <Icon style={{ cursor: 'pointer' }} onClick={handleInvitePeopleModal} size="big" name="close" />
      </div>
      <div>
        <Icon size="big" name="linkify" color="blue" />
      </div>
      <div style={{ fontSize: '32px', fontWeight: 'lighter' }}>
				Invite Members to <span style={{ fontWeight: 'bold' }}>{teamName}</span>
      </div>
    </div>
    <Modal.Content>
      <form
        style={{ display: 'flex', justifyContent: 'center' }}
        onSubmit={event => event.preventDefault()}
      >
        <div style={{ width: '60%' }}>
          <Popup
            inverted
            trigger={
              <Input
                fluid
                onChange={handleInvitePeopleChange}
                value={values.email}
                name="email"
                error={!!errors.email}
                size="huge"
                action={{ icon: 'mail outline', size: 'huge' }}
                actionPosition="left"
                placeholder="name@example.com"
                style={{ padding: '15px 0', width: '100%' }}
              />
						}
            content={errors.email}
            open={!!errors.email}
            position="right center"
          />
        </div>
      </form>
    </Modal.Content>
    <div
      style={{
				display: 'flex',
				justifyContent: 'flex-end',
				padding: '10px',
			}}
    >
      <Button invite onClick={() => handleInvitePeopleSubmit(teamId)}>
				Send Invitation
      </Button>
    </div>
  </Modal>
);

export default InvitePeopleModal;
