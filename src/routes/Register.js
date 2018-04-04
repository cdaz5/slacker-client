import React, { Component, Fragment } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Input, Popup, Icon } from 'semantic-ui-react';
import { FadingCircle } from 'better-react-spinkit';
import { Link } from 'react-router-dom';
import { wsLink } from '../apollo';

import Button from '../components/buttons/Button';

class Register extends Component {
	state = {
    loading: false,
    demo: false,
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

	handleChange = (event) => {
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
      loading: false,
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

	handleSubmit = async (type) => {
    if (type === 'demo') {
      this.setState({
        ...this.state,
        demo: true,
      });
      const response = await this.props.loginMutation({
        variables: { 
          email: 'anonymous@gmail.com',
          password: 'password',
        },
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
    } else {
      this.setState({
        ...this.state,
        loading: true,
      });
      const response = await this.props.registerMutation({
        variables: this.state.values,
      });
      this.handleClear();
      console.log(response);
      const { ok, errors } = response.data.register;
      if (ok) {
        this.props.history.push('/login');
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
    }
	};

	render() {
		const { values, errors, touched, loading, demo } = this.state;
		return (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div
      style={{ display: 'flex', flexDirection: 'column', width: '30vw', alignItems: 'center' }}
    >
      <h1 style={{ margin: 0 }}>Register</h1>
      <form onSubmit={event => event.preventDefault()}>
        <Popup
          inverted
          trigger={
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
          }
          content={errors.username}
          open={!!errors.username}
          position='right center'
        />
        <Popup
          inverted
          trigger={
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
            onClick={this.handleSubmit}
            disabled={!values.email || !values.password || !values.username}
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
          <Button flex onClick={() => this.handleSubmit('demo')}>
            {
              demo ?
                <Fragment>
                  <span style={{ marginRight: '10px'}}>
                  Demo
                  </span>
                  <span>
                    <FadingCircle size={20} color='#42f4b0' />
                  </span>
                </Fragment>
              :
                <Fragment>
                  Demo
                  <Popup
                    trigger={<Icon style={{ margin: '0' }} name='question' size='small' />}
                    content='Click the demo button to forgo sign up and login automatically as username: anonymous'
                    inverted
                  />
                </Fragment>
            }
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ marginRight: '5px' }}>already a member?</span><Link to='/login'>login</Link>
        </div>
      </form>
    </div>
  </div>
		);
	}
}

const emailInput = (values, errors) => (
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
);

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

export default compose(
  graphql(registerMutation, {
    name: 'registerMutation',
  }),
  graphql(loginMutation, {
    name: 'loginMutation',
  }),
)(Register);
