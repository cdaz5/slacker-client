import React from 'react';
import styled from 'styled-components';
import { withFormik } from 'formik';
// import Input from '../inputs/Input';
import { Icon, Input, Label } from 'semantic-ui-react';
import Uploader from './FileUpload';

const TextContainer = styled.div`
	grid-column: 3;
	grid-row: 3;
	color: #fff;
	padding: 0.5em;
	text-align: center;
`;

const LabelWrapper = styled.span`
	display: flex;
	justify-content: center;
	align-items: center;
	border-right: 2px solid rgb(112, 114, 115);
	&: hover {
		background-color: #2da664;
	}
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
      style={{
				width: '100%',
				border: '2px solid #707273',
				borderRadius: '6px',
			}}
      action
      labelPosition="left"
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
    >
      <Label
        style={{
					backgroundColor: 'transparent',
					borderRight: '2px solid #707273',
					cursor: 'pointer',
				}}
      >
        <Uploader>
          <Icon
            onClick={() => console.log('click')}
            name="add"
            size="large"
            style={{ margin: '0px' }}
          />
        </Uploader>
      </Label>
      <input style={{ backgroundColor: 'transparent' }} />
    </Input>
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
