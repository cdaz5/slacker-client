import styled from 'styled-components';

const Button = styled.button`
	/* Adapt the colours based on primary prop */
	background: ${props => (props.primary ? '#4286f4' : '#fff')};
	color: ${props => (props.primary ? '#fff' : '#4286f4')};
	font-size: 1.5em;
	padding: 0.25em 1em;
	border: 1px solid #4286f4;
	border-radius: 3px;
	&:hover {
		background: ${props => (props.primary ? '#fff' : '#4286f4')};
		color: ${props => (props.primary ? '#4286f4' : '#fff')};
	}
`;

export default Button;
