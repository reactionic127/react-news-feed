import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import {
  Grid,
  Col,
  Row,
  Panel,
  PageHeader,
  Button,
  FormGroup,
} from 'react-bootstrap';

import FormInput, {
  required,
  email,
  minLength,
} from '../FormInput/FormInput';


class LoginForm extends Component {
  render() {
    const { handleSubmit, isFetching, errorMessage } = this.props;

    const contentFooter = (
      <div className="login-footer">
        <Row>
          <Col xs={12} sm={6}>
            {'Don\'t have an account yet?'} <Link to="/signup">Sign Up</Link>
          </Col>
          <Col xs={12} sm={6}>
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Link to="/forgot">Forgot your password?</Link>
            </div>
          </Col>

        </Row>
      </div>
    );

    return (
      <Grid>
        <PageHeader>Welcome</PageHeader>
        <Row>
          <Col xs={12} mdPush={3} md={6}>

            <Panel header="Log into Your Account" footer={contentFooter}>
              <form onSubmit={handleSubmit}>

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

                <FormGroup>
                  <Button type="submit" bsStyle="default" block disabled={isFetching}>
                    Sign In
                  </Button>
                </FormGroup>

                {
                  errorMessage && (
                    <div style={{ color: '#AD0D00', padding: '10px' }}>
                      {errorMessage}
                    </div>
                  )
                }
              </form>

            </Panel>

          </Col>
        </Row>
      </Grid>
    );
  }
}

export default reduxForm({ form: 'login' })(LoginForm);
