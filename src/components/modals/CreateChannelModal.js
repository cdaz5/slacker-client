import React from 'react';
import { Modal, Popup, Input, Checkbox, Icon } from 'semantic-ui-react';

import MultiSelect from '../../utils/MultiSelect';
import Button from '../buttons/Button';

const CreateChannelModal = ({
	isOpen,
	handleCreateChannelModal,
	handleCreateChannelChange,
	handleCreateChannelSubmit,
	values,
	teamId,
  members,
  currentUserId
}) => (
  <Modal size='small' open={isOpen}>
    <div style={{display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    }}>
          <div style={{ alignSelf: 'flex-end', padding: '5px' }}>
        <Icon style={{ cursor: 'pointer', margin: '0px' }} onClick={handleCreateChannelModal} size="big" name="close" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
        <div
      style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '10px',
			}}
    >
      <div>
				<p style={{ margin: '0px', fontSize: '32px', fontWeight: 'bold' }}>Create a channel</p>
        <p>
          Channels are where your members communicate. They're best when organized around a topic
          - #leads, for example.
        </p>
      </div>
    </div>
    <Modal.Content style={{ display: 'flex', justifyContent: 'center'}}>
      <form onSubmit={event => event.preventDefault()} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Checkbox
            onChange={(event, data) => handleCreateChannelChange(event, data)}
            checked={!values.public}
            name="public"
            label="Private?"
            toggle
            style={{ padding: '15px', width: 'fit-content' }}
          />
        <Popup
          inverted
          trigger={
            <Input
              onChange={handleCreateChannelChange}
              value={values.channelName}
              name="channelName"
							// error={!!errors.email}
              size="huge"
              placeholder="Channel name..."
              style={{ padding: '15px 0', width: '100%' }}
            />
					}
					// content={errors.email}
					// open={!!errors.email}
          position="right center"
        />
        {values.public ? null : (
          <Popup
            inverted
            trigger={
              <MultiSelect
                id="invitedMembers"
                currentUserId={currentUserId}
                teamId={teamId}
                placeholder="Search by name"
                value={members}
                handleChange={(event, data) =>
									handleCreateChannelChange(event, data)
								}
              />
						}
						// content={errors.email}
						// open={!!errors.email}
            position="right center"
          />
				)}
      </form>
    </Modal.Content>
    <div style={{ alignSelf: 'flex-end', padding: '10px 0' }}>
      <Button invite onClick={() => handleCreateChannelSubmit(teamId)}>
				Create Channel
      </Button>
    </div>
    </div>
    </div>
  </Modal>
);

export default CreateChannelModal;
