import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader, Message, Input } from 'semantic-ui-react';

import Button from '../components/buttons/Button';

class Register extends Component {
	state = {
		values: {
			username: '',
			email: '',
			password: '',
		},
		errors: {
			username: '',
			email: '',
			password: '',
		},
		touched: {
			username: '',
			email: '',
			password: '',
		},
	};

	handleChange = event => {
		this.setState({
			...this.state,
			values: {
				...this.state.values,
				[event.target.name]: event.target.value,
			},
		});
	};

	handleClear = () => {
		this.setState({
			values: {
				username: '',
				email: '',
				password: '',
			},
			errors: {
				username: '',
				email: '',
				password: '',
			},
			touched: {
				username: '',
				email: '',
				password: '',
			},
		});
	};

	handleSubmit = async () => {
		const response = await this.props.mutate({
			variables: this.state.values,
		});
		this.handleClear();
		console.log(response);
		const { ok, errors } = response.data.register;
		if (ok) {
			this.props.history.push('/home');
		} else {
			const errs = {};
			errors.forEach(err => (errs[`${err.path}`] = err.message));
			this.setState({
				...this.state,
				errors: {
					...this.state.errors,
					...errs,
				},
			});
		}
	};

	render() {
		const { values, errors, touched } = this.state;
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div
					style={{ display: 'flex', flexDirection: 'column', width: '30vw', alignItems: 'center' }}
				>
					<h1 style={{ margin: 0 }}>Register</h1>
					<Input
						onChange={this.handleChange}
						value={values.username}
						name="username"
						size="huge"
						error={!!errors.username}
						action={{ icon: 'user circle', size: 'huge' }}
						actionPosition="left"
						placeholder="Username..."
						style={{ padding: '15px 0', width: '100%' }}
					/>
					{errors.username ? (
						<Message negative>
							<p>{errors.username}</p>
						</Message>
					) : null}

					<Input
						onChange={this.handleChange}
						value={values.email}
						name="email"
						error={!!errors.email}
						size="huge"
						action={{ icon: 'mail outline', size: 'huge' }}
						actionPosition="left"
						placeholder="Email..."
						style={{ padding: '15px 0', width: '100%' }}
					/>
					{errors.email ? (
						<Message negative>
							<p>{errors.email}</p>
						</Message>
					) : null}
					<Input
						onChange={this.handleChange}
						value={values.password}
						name="password"
						error={!!errors.password}
						type="password"
						size="huge"
						action={{ icon: 'lock', size: 'huge' }}
						actionPosition="left"
						placeholder="Password..."
						style={{ padding: '15px 0', width: '100%' }}
					/>
					{errors.password ? (
						<Message negative>
							<p>{errors.password}</p>
						</Message>
					) : null}
					<div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
						<Button onClick={this.handleClear}>Clear</Button>
						<Button primary onClick={this.handleSubmit}>
							Submit
						</Button>
					</div>
				</div>
			</div>
		);
	}
}

const registerMutation = gql`
	mutation($username: String!, $email: String!, $password: String!) {
		register(username: $username, email: $email, password: $password) {
			ok
			errors {
				path
				message
			}
		}
	}
`;

export default graphql(registerMutation)(Register);