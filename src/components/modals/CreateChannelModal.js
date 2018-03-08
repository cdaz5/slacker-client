import React from 'react';
import { Modal, Popup, Input, Checkbox } from 'semantic-ui-react';

import Button from '../buttons/Button';

const CreateChannelModal = ({
	isOpen,
	handleCreateChannelModal,
	handleCreateChannelChange,
	handleCreateChannelSubmit,
  values,
  teamId,
}) => (
  <Modal open={isOpen}>
    <Modal.Header>Select a Photo</Modal.Header>
    <Modal.Content>
      <form onSubmit={event => event.preventDefault()}>
        <Popup
          inverted
          trigger={
            <Input
              onChange={handleCreateChannelChange}
              value={values.channelName}
              name="channelName"
							// error={!!errors.email}
              size="huge"
              action={{ icon: 'mail outline', size: 'huge' }}
              actionPosition="left"
              placeholder="Channel name..."
              style={{ padding: '15px 0', width: '100%' }}
            />
					}
					// content={errors.email}
					// open={!!errors.email}
          position="right center"
        />
        <Popup
          inverted
          trigger={
            <Checkbox
              onChange={(event, data) => handleCreateChannelChange(event, data)}
              checked={values.public}
              name="public"
              label="is this channel public?"
							// error={!!errors.email}
              style={{ padding: '15px 0', width: '100%' }}
            />
					}
					// content={errors.email}
					// open={!!errors.email}
          position="right center"
        />
      </form>
    </Modal.Content>
    <div>
      <Button onClick={handleCreateChannelModal}>Cancel</Button>
      <Button primary onClick={() => handleCreateChannelSubmit(teamId)}>Create</Button>
    </div>
  </Modal>
);

export default CreateChannelModal;
