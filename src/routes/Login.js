import React, { Component, Fragment } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Input, Popup } from 'semantic-ui-react';
import { FadingCircle } from 'better-react-spinkit';
import { Link } from 'react-router-dom';

import { wsLink } from '../apollo';
import Button from '../components/buttons/Button';

class Login extends Component {
	constructor(props) {
		super(props);

		extendObservable(this, {
      loading: false,
			email: '',
      password: '',
      errors: {
        email: '',
        password: '',
      },
		});
	}

	handleChange = (event) => {
		this[event.target.name] = event.target.value;
	};

	handleSubmit = async () => {
    this.loading = true;
		const { email, password } = this;
    const response = await this.props.mutate({
      variables: { email, password },
    });
    this.handleClear();
    console.log('response', response)
    const { ok, refreshToken, token, errors } = response.data.login;
    this.loading = false;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      wsLink.subscriptionClient.tryReconnect();
      this.props.history.push('/view-team');
    } else {
      const errs = {};
      errors.forEach(err => (errs[`${err.path}`] = err.message));
      this.errors = {
        ...errs,
      };
    }
	};

	handleClear = () => {
		this.email = '';
    this.password = '';
    this.errors = {
      password: '',
      email: '',
    }
	};

	render() {
		const { email, password, errors, loading } = this;
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
      <form onSubmit={event => event.preventDefault()}>
        <Popup
          inverted
          trigger={
            <Input
              onChange={this.handleChange}
              value={email}
              name="email"
              error={!!errors.email}
              size="huge"
              action={{ icon: 'mail outline', size: 'huge' }}
              actionPosition="left"
              placeholder="Email..."
              style={{ padding: '15px 0', width: '100%' }}
            />
          }
          content={errors.email}
          open={!!errors.email}
          position='right center'
        />
        <Popup
          inverted
          trigger={
            <Input
              onChange={this.handleChange}
              value={password}
              name="password"
              error={!!errors.password}
              type="password"
              size="huge"
              action={{ icon: 'lock', size: 'huge' }}
              actionPosition="left"
              placeholder="Password..."
              style={{ padding: '15px 0', width: '100%' }}
            />
          }
          content={errors.password}
          open={!!errors.password}
          position='right center'
        />
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          <Button onClick={this.handleClear}>Clear</Button>
          <Button
            flex
            primary
            disabled={!email || !password}
            onClick={this.handleSubmit}
          >
            {
              loading ?
                <Fragment>
                  <span style={{ marginRight: '10px'}}>
                    Submit
                  </span>
                  <span>
                    <FadingCircle size={20} color='#42f4b0' />
                  </span>
                </Fragment>
                :
                'Submit'
              }
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ marginRight: '5px' }}>not a member?</span><Link to='/register'>Sign up</Link>
        </div>
      </form>
    </div>
  </div>
		);
	}
}

const loginMutation = gql`
	mutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			ok
			token
			refreshToken
			errors {
				path
				message
			}
		}
	}
`;

export default graphql(loginMutation)(observer(Login));
