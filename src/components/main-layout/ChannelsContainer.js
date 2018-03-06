import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ChannelContainer = styled.div`
	grid-column: 2;
	grid-row: 1 / 4;
	background-color: #4e3a4c;
	color: #fff;
	padding: 1em;
`;

const TeamName = styled.h1`
	color: #ffff;
	font-size: 25px;
	margin: 0;
`;

const SideBarUl = styled.ul`
	width: 100%;
	list-style: none;
	padding-left: 0px;
`;

const SideBarLi = styled.li`
  display: ${prop => (prop.header ? 'flex' : '')};
  justify-content: ${prop => (prop.header ? 'space-between' : '')};
  align-items: center;
	font-size: 16px;
	font-weight: lighter;
	color: ${prop => (prop.focus ? '#ffff' : '#cac4c9')};
  padding: 5px 0;
	&:hover {
		background: ${prop => (prop.header ? '' : '#3e313c')};
		color: ${prop => (prop.header || prop.focus ? '#ffff' : '#cac4c9')};
	}
`;

const UserName = styled.div`
	font-size: 20px;
	padding: 5px 0;
	color: #cac4c9;
	font-weight: lighter;
	&:hover {
		background: #3e313c;
	}
`;

const Green = styled.span`
	color: #38978d;
`;

const InvitePeopleLink = styled.a`
  padding: 5px 0;
  font-size: 20px;
  width: 100%;
  color: #ffff;
  font-weight: bold;
  &:hover {
    background: #3e313c;
    color: #ffff;
	}
`;


/* eslint-disable-next-line */
const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

export default ({
 userName, teamName, channels, users, handleCreateChannelModal, teamId, currentChannelId, handleInvitePeopleModal
}) => (
  <ChannelContainer>
    <div>
      <TeamName>{teamName}</TeamName>
      <UserName>
        <Bubble />
        {` ${userName}`}
      </UserName>
    </div>
    <div>
      <SideBarUl>
        <SideBarLi header>
					Channels <Icon name="add circle" onClick={handleCreateChannelModal} />
        </SideBarLi>
        {channels.map(channel => (
          <Link key={channel.id} to={`/view-team/${teamId}/${channel.id}`}><SideBarLi focus={currentChannelId === channel.id ? true : false} key={channel.id}>{`# ${channel.name}`}</SideBarLi></Link>
				))}
      </SideBarUl>
    </div>
    <div>
      <SideBarUl>
        <SideBarLi header>Direct Messages</SideBarLi>
        <SideBarLi key="slackbot">
          {/* eslint-disable-next-line */}
					<Bubble /> {` slackbot`}
        </SideBarLi>
        {users.map(user => (
          <SideBarLi key={user.id}>
            <Bubble /> {` ${user.name}`}
          </SideBarLi>
				))}
      </SideBarUl>
    </div>
    <div style={{ display: 'flex' }}>
      <InvitePeopleLink href='#invite-people' onClick={handleInvitePeopleModal}>+ Invite People</InvitePeopleLink>
    </div>
  </ChannelContainer>
);
