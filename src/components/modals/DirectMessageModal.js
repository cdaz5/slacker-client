import React from 'react';
import { Modal, Popup, Input } from 'semantic-ui-react';
import Downshift from 'downshift';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import Button from '../buttons/Button';

const DirectMessageModal = ({
  isOpen,
  history,
	handleDirectMessageModal,
	data: { loading, getTeamMembers },
	// handleDirectMessageChange,
	// handleDirectMessageSubmit,
	// values,
	teamId,
}) => (
  <Modal open={isOpen}>
    <Modal.Header>Select a Photo</Modal.Header>
    <Modal.Content>
      <form onSubmit={event => event.preventDefault()}>
        {loading ? null : (
          <Downshift
            onChange={(selected) => {
              history.push(`/view-team/user/${teamId}/${selected.id}`);
              handleDirectMessageModal();
            }}
            render={({
							getInputProps,
							getItemProps,
							isOpen,
							inputValue,
							selectedItem,
							highlightedIndex,
						}) => (
  <div>
    <Input {...getInputProps({ placeholder: 'Search for a member' })} />
    {isOpen ? (
      <div style={{ border: '1px solid #ccc' }}>
        {getTeamMembers
											.filter(i =>
													!inputValue ||
													i.username
														.toLowerCase()
														.includes(inputValue.toLowerCase()))
											.map((item, index) => (
  <div
    {...getItemProps({ item })}
    key={item.id}
    style={{
														backgroundColor:
															highlightedIndex === index
																? 'gray'
																: 'white',
														fontWeight:
															selectedItem === item
																? 'bold'
																: 'normal',
													}}
  >
    {item.username}
  </div>
											))}
      </div>
								) : null}
  </div>
						)}
          />
				)}
      </form>
    </Modal.Content>
    <div>
      <Button onClick={handleDirectMessageModal}>Cancel</Button>
    </div>
  </Modal>
);

const getTeamMembersQuery = gql`
	query($teamId: Int!) {
		getTeamMembers(teamId: $teamId) {
			id
			username
		}
	}
`;

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));
