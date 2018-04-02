import styled from 'styled-components';

const Button = styled.button`
  /* Adapt the colours based on primary prop */
  display: ${props => (props.flex ? 'flex' : '')};
	background: ${props =>
		(props.disabled ? '#f1f2f2' : props.primary ? '#4286f4' : props.invite ? '#2da664' : '#fff')};
	color: ${props =>
		(props.disabled ? '#b5b5b5' : props.primary ? '#fff' : props.invite ? '#fff' : '#4286f4')};
	font-size: 1.5em;
  height: ${props => (props.DM ? '54.2812px' : '')};
  margin-left: ${props => (props.DM ? '20px' : '')}
	font-weight: lighter;
	padding: 0.5em 1em;
	border: ${props => (props.disabled ? 'none' : props.invite ? 'none' : '1px solid #4286f4')};
  border-radius: 3px;
  align-items: center;
	cursor: pointer;
	&:hover {
		background: ${props =>
			(props.disabled ? '' : props.primary ? '#fff' : props.invite ? '#2da664' : '#4286f4')};
		color: ${props => (props.disabled ? '#b5b5b5' : props.primary ? '#4286f4' : '#fff')};
	}
`;

export default Button;
