import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUser } from '../../actions/users';
import SignUpForm from './SignUpForm';

class SignUpPage extends Component {

  componentWillMount() {
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    if (values.password !== values.password2) {
      alert("Passwords don't match");
    } else {
      this.props.dispatch(createUser(values));
    }
  }

  render() {
    return <SignUpForm onSubmit={this.handleSubmit} />;
  }
}

export default connect()(SignUpPage);
