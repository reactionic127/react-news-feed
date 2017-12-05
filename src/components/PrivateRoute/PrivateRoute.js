import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, token, ...rest }) => {
  const render = (props) => {

    if (token) {
      return (<Component {...props} />);
    }

    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    );
  };

  return <Route {...rest} render={render} />;
};

function mapStateToProps(state, props) {
  return {
    token: state.userSession.token,
  };
}

export default withRouter(connect(mapStateToProps)(PrivateRoute));
