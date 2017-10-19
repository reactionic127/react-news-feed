import React, { Component } from 'react';
import { connect } from 'react-redux';

import { requestForgotPassword } from '../../actions/emailSessionVerification';
import ForgotPasswordForm from './ForgotPasswordForm';

class ForgotPasswordPage extends Component {

  componentWillMount() {
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    this.props.dispatch(requestForgotPassword(values.email));
  }

  render() {
    return <ForgotPasswordForm onSubmit={this.handleSubmit} />;
  }
}

export default connect()(ForgotPasswordPage);
