import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader, Message, Input } from 'semantic-ui-react';

import Button from '../components/buttons/Button';

export default observer(
	class Login extends Component {
		constructor(props) {
			super(props);

			extendObservable(this, {
				email: '',
				password: '',
			});
		}

		handleChange = event => {
			this[event.target.name] = event.target.value;
		};

		handleSubmit = () => {
			console.log(this.email, this.password);
		};

		handleClear = () => {
			this.email = '';
			this.password = '';
		};

		render() {
			const { email, password } = this;
			return (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '30vw',
							alignItems: 'center',
						}}
					>
						<h1 style={{ margin: 0 }}>Login</h1>
						<Input
							onChange={this.handleChange}
							value={email}
							name="email"
							//error={!!errors.email}
							size="huge"
							action={{ icon: 'mail outline', size: 'huge' }}
							actionPosition="left"
							placeholder="Email..."
							style={{ padding: '15px 0', width: '100%' }}
						/>
						{/* {errors.email ? (
          <Message negative>
            <p>{errors.email}</p>
          </Message>
        ) : null} */}
						<Input
							onChange={this.handleChange}
							value={password}
							name="password"
							//error={!!errors.password}
							type="password"
							size="huge"
							action={{ icon: 'lock', size: 'huge' }}
							actionPosition="left"
							placeholder="Password..."
							style={{ padding: '15px 0', width: '100%' }}
						/>
						{/* {errors.password ? (
          <Message negative>
            <p>{errors.password}</p>
          </Message>
        ) : null} */}
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
	},
);
