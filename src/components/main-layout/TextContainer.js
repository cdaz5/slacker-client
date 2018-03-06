import React from 'react';
import styled from 'styled-components';
import { withFormik } from 'formik';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Input from '../inputs/Input';

const TextContainer = styled.div`
	grid-column: 3;
	grid-row: 3;
	color: #fff;
	padding: 1em;
	text-align: center;
`;

const Messaging = ({
	channelName,
	values,
	handleChange,
	handleBlur,
	handleSubmit,
	isSubmitting,
}) => (
  <TextContainer>
    <Input
      onKeyDown={(event) => {
				if (event.keyCode === 13 && !isSubmitting) {
					handleSubmit(event);
				}
			}}
      name="message"
      value={values.message}
      placeholder={`Message #${channelName}`}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  </TextContainer>
);

const createMessageMutation = gql`
	mutation($channelId: Int!, $text: String!) {
		createMessage(channelId: $channelId, text: $text)
	}
`;

export default compose(
	graphql(createMessageMutation),
	withFormik({
		mapPropsToValues: () => ({ message: '' }),
		handleSubmit: async (
			values,
			{ props: { channelId, mutate }, setSubmitting, resetForm },
		) => {
			if (!values.message || !values.message.trim()) {
				setSubmitting(false);
				return;
			}
			await mutate({
				variables: {
					channelId,
					text: values.message,
				},
			});
			resetForm(false);
		},
	}),
)(Messaging);
