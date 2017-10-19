import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { createUserSession } from '../../actions/userSession';
import LogInForm from './LogInForm';

class LogIn extends Component {
  componentWillMount() {
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.dispatch(createUserSession(values.email, values.password));
  }

  render() {
    if (this.props.token) {
      const { from } = this.props.location.state || {
        from: { pathname: '/' },
      };

      return <Redirect to={from} />;
    }

    return (
      <LogInForm
        errorMessage={this.props.errorMessage}
        isFetching={this.props.isFetching}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.userSession.token,
    errorMessage: state.userSession.errorMessage,
    isFetching: state.userSession.isFetching,
  };
}

export default connect(mapStateToProps)(LogIn);
