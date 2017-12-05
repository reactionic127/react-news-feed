import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  Grid,
  Col,
  Row,
  Panel,
  PageHeader,
  Button,
  FormGroup,
} from 'react-bootstrap';

import FormInput, { required, email, minLength } from '../FormInput/FormInput';

class SignUpForm extends Component {
  render() {
    const { handleSubmit, users, createdUser } = this.props;

    let content;
    let contentFooter;

    if (createdUser) {
      contentFooter = (
        <div className="login-footer">
          <span>
            If you have already activated the account, please
            {' '}
            <Link to="/">Sign In</Link>
            .
          </span>
        </div>
      );

      content = (
        <h3>
          Please, check your email to activate your account.
        </h3>
      );
    } else {
      contentFooter = (
        <div className="login-footer">
          <span>
            Already have an account? <Link to="/">Sign In</Link>
          </span>
        </div>
      );

      content = (
        <form onSubmit={handleSubmit}>
          <Field
            name="company"
            component={FormInput}
            type="text"
            label="Company"
            validate={required}
          />
          <Field
            name="fullName"
            component={FormInput}
            type="text"
            label="Full Name"
            validate={required}
          />
          <Field
            name="email"
            component={FormInput}
            type="text"
            label="Email"
            validate={[required, email]}
          />
          <Field
            name="password"
            component={FormInput}
            type="password"
            label="Password"
            validate={[required, minLength(6)]}
          />
          <Field
            name="password2"
            component={FormInput}
            type="password"
            label="Repeat Password"
            validate={[required, minLength(6)]}
          />

          <FormGroup>
            <Button
              type="submit"
              bsStyle="default"
              block
              disabled={users.isFetching}
            >
              Sign In
            </Button>
          </FormGroup>

          {createdUser &&
            <div style={{ color: '#006B00', padding: '10px' }}>
              User created successfully!
            </div>}
          {users.errorMessage &&
            <div style={{ color: '#AD0D00', padding: '10px' }}>
              {users.errorMessage}
            </div>}
        </form>
      );
    }

    return (
      <Grid>
        <PageHeader>Welcome</PageHeader>
        <Row>
          <Col xs={12} mdPush={3} md={6}>
            <Panel header="Create a new Account" footer={contentFooter}>
              {content}
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    createdUser: state.users.user,
    users: state.users,
  };
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'signup',
  })(SignUpForm),
);
