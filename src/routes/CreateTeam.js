import React, { Component, Fragment } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader, Message, Input, Popup } from 'semantic-ui-react';
import { FadingCircle } from 'better-react-spinkit';

import Button from '../components/buttons/Button';

class CreateTeam extends Component {
	constructor(props) {
		super(props);

		extendObservable(this, {
      loading: false,
			name: '',
      errors: {
        name: '',
      },
		});
  }

	handleChange = (event) => {
		this[event.target.name] = event.target.value;
	};

	handleSubmit = async () => {
    this.loading = true;
    const { name } = this;
    let response = null
    try {
      response = await this.props.mutate({
        variables: { name },
      });
    } catch (err) {
      this.props.history.push('/login');
      return;
    }
    this.handleClear();
    const { ok, errors, team } = response.data.createTeam;
    console.log(response)
    if (ok) {
      this.props.history.push(`/view-team/${team.id}`);
    } else {
      const errs = {};
      errors.forEach(err => (errs[`${err.path}`] = err.message));
      //debugger
      this.errors = {
        ...errs
      };
    }
	};

	handleClear = () => {
    this.loading = false,
		this.name = '';
    this.errors = {
      name: ''
    }
	};

	render() {
		const { name, errors, loading } = this;
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
      <h1 style={{ margin: 0 }}>Create a Team</h1>
      <form onSubmit={event => event.preventDefault()}>
        <Popup
          inverted
          trigger={
            <Input
              onChange={this.handleChange}
              value={name}
              name="name"
              error={!!errors.name}
              size="huge"
              action={{ icon: 'users', size: 'huge' }}
              actionPosition="left"
              placeholder="Team Name..."
              style={{ padding: '15px 0', width: '100%' }}
            />
          }
          content={errors.name}
          open={!!errors.name}
          position='right center'
        />
        <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
          <Button onClick={this.handleClear}>Clear</Button>
          <Button flex primary onClick={this.handleSubmit}>
          {loading ? <Fragment><span style={{ marginRight: '10px'}}>{'Submit '}</span><span><FadingCircle size={20} color='#42f4b0' /></span></Fragment> : 'Submit' }
          </Button>
        </div>
      </form>
    </div>
  </div>
		);
	}
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
