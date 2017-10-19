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

import FormInput, {
  required,
  email,
} from '../FormInput/FormInput';

class ForgotPasswordForm extends Component {
  render() {
    const { handleSubmit, forgotData } = this.props;

    let content;
    let contentFooter;

    if (forgotData.verificationSessionEmailSent) {
      contentFooter = (
        <div className="login-footer">
          <span>
            Go to <Link to="/">Login</Link>.
          </span>
        </div>
      );

      content = (
        <h3>
          Please check your email and follow the instructions there.
        </h3>
      );
    } else {
      contentFooter = (
        <div className="login-footer">
          <span>
            {'Don\'t have an account yet?'} <Link to="/signup">Sign Up</Link>
          </span>
        </div>
      );

      content = (
        <form onSubmit={handleSubmit}>
          <Field
            name="email"
            component={FormInput}
            type="text"
            label="Email"
            validate={[required, email]}
          />

          <FormGroup>
            <Button type="submit" bsStyle="default" block disabled={forgotData.isFetching}>
              Recover Password
            </Button>
          </FormGroup>

          {
            forgotData.errorMessage && (
              <div style={{ color: '#AD0D00', padding: '10px' }}>
                {forgotData.errorMessage}
              </div>
            )
          }
        </form>
      );
    }

    return (
      <Grid>
        <PageHeader>Account</PageHeader>
        <Row>
          <Col xs={12} mdPush={3} md={6}>
            <Panel header={'Forgot Password?'} footer={contentFooter}>
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
    forgotData: state.forgot,
  };
}

export default connect(mapStateToProps)(
  reduxForm({
    form: 'forgot',
  })(ForgotPasswordForm),
);
