import React from 'react';
import styled from 'styled-components';
import { withFormik } from 'formik';
import Input from '../inputs/Input';

const TextContainer = styled.div`
	grid-column: 3;
	grid-row: 3;
	color: #fff;
	padding: 1em;
	text-align: center;
`;

const Messaging = ({
	placeholder,
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
      placeholder={`Message #${placeholder}`}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  </TextContainer>
);

export default withFormik({
	mapPropsToValues: () => ({ message: '' }),
	handleSubmit: async (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
		if (!values.message || !values.message.trim()) {
			setSubmitting(false);
			return;
		}
		await onSubmit(values.message);
		resetForm(false);
	},
})(Messaging);
