import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const TeamsContainer = styled.div`
	grid-column: 1;
	grid-row: 1 / 4;
	background-color: #362234;
	color: #fff;
	padding: 1em;
	text-align: center;
`;

const TeamsUl = styled.ul`
	width: 100%;
	padding-left: 0px;
	list-style: none;
`;

const Teamsli = styled.li`
	height: 50px;
	width: 50px;
	background-color: #676066;
	color: #ffff;
	margin: auto;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24px;
	border-radius: 11px;
	&:hover {
		border-style: solid;
		border-width: thick;
		border-color: #767676;
	}
`;

export default ({ teams }) => (
  <TeamsContainer>
    <TeamsUl>
      {teams.map(team => (
        <Link key={team.id} to={`/view-team/${team.id}`}>
          <Teamsli>{team.letter}</Teamsli>
        </Link>
			))}
    </TeamsUl>
  </TeamsContainer>
);
