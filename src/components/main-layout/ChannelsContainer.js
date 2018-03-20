import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ChannelContainer = styled.div`
	grid-column: 2;
	grid-row: 1 / 4;
	background-color: #4e3a4c;
	color: #fff;
  padding: 1em;
  overflow-y: auto;
`;

const TeamName = styled.h1`
	color: #ffff;
	font-size: 20px;
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
	background: ${prop => (prop.focus ? '#4C9689' : '#4e3a4c')};
	color: ${prop => (prop.focus ? '#ffff' : '#cac4c9')};
	padding: 5px 0;
	&:hover {
		background: ${prop => (prop.header ? '' : prop.focus ? '#4C9689' : '#3e313c')};
		color: ${prop => (prop.header ? '#ffff' : prop.focus ? '#ffff' : '#cac4c9')};
	}
`;

const UserName = styled.div`
	font-size: 16px;
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

const White = styled.span`
	color: #fff;
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
const Bubble = ({ on, focus }) => (on && focus ? <White>●</White> : on ? <Green>●</Green> : '○');

export default ({
	userName,
	teamName,
	channels,
	dmChannels,
	handleCreateChannelModal,
	teamId,
	currentChannelId,
	handleInvitePeopleModal,
	isOwner,
	handleDirectMessageModal,
}) => (
		<ChannelContainer>
  <div>
    <TeamName>{teamName}</TeamName>
    <UserName>
      <Bubble on />
      {` ${userName}`}
    </UserName>
  </div>
  <div>
    <SideBarUl>
      <SideBarLi header>
						Channels{' '}
        {isOwner ? (
          <Icon
            style={{ cursor: 'pointer' }}
            name="add circle"
            onClick={handleCreateChannelModal}
          />
						) : null}
      </SideBarLi>
      {channels.map(channel => (
        <Link key={channel.id} to={`/view-team/${teamId}/${channel.id}`}>
          <SideBarLi
            focus={currentChannelId === channel.id}
            key={channel.id}
          >
            {channel.public ? (
									`# ${channel.name}`
								) : (
  <Fragment>
    <Icon style={{ width: 'auto' }} name="lock" />
    {`${channel.name}`}
  </Fragment>
								)}
          </SideBarLi>
        </Link>
					))}
    </SideBarUl>
  </div>
  <div>
    <SideBarUl>
      <SideBarLi header>
						Direct Messages{' '}
        <Icon
          style={{ cursor: 'pointer' }}
          name="add circle"
          onClick={handleDirectMessageModal}
        />
      </SideBarLi>
      <SideBarLi key="slackbot">
        {/* eslint-disable-next-line */}
						<Bubble on /> {` slackbot`}
      </SideBarLi>
      {dmChannels.map(channel => (
        <Link key={channel.id} to={`/view-team/${teamId}/${channel.id}`}>
          <SideBarLi focus={currentChannelId === channel.id}>
            <Bubble on focus={currentChannelId === channel.id} />{' '}
            {` ${channel.name}`}
          </SideBarLi>
        </Link>
					))}
    </SideBarUl>
  </div>
  <div style={{ display: 'flex' }}>
    {isOwner ? (
      <InvitePeopleLink href="#invite-people" onClick={handleInvitePeopleModal}>
						+ Invite People
      </InvitePeopleLink>
				) : null}
  </div>
		</ChannelContainer>
	);
