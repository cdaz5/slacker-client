import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam';

const isAuthenticated = () => {
	const token = localStorage.getItem('token');
	const refreshToken = localStorage.getItem('refreshToken');
	try {
		jwtDecode(token);
    const { exp } = jwtDecode(refreshToken);
    if (Date.now() / 1000 > exp) {
      return false;
    }
	} catch (err) {
		console.log(err);
		return false;
	}
	return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
			(isAuthenticated() ? (
  <Component {...props} />
			) : (
  <Redirect
    to={{
						pathname: '/login',
					}}
  />
			))
		}
  />
);

export default () => (
  <Router>
    <Switch>
      <Route exact path="/home" component={Home} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/view-team/:teamId?/:channelId?" component={ViewTeam} />
      <PrivateRoute exact path="/create-team" component={CreateTeam} />
    </Switch>
  </Router>
);
