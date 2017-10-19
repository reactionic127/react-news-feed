import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import { updateUser } from '../../actions/users';
import './UserSettings.css';

class UserSettings extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
    this.handleSubmitEmail = this.handleSubmitEmail.bind(this);
    this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
  }

  handleSubmitEmail(event) {
    event.preventDefault();

    const email = event.target.email.value;

    this.setState(() => ({ emailError: null }));

    if (!email) {
      return this.setState(() => ({ emailError: 'Email cannot be empty' }));
    }

    return this.props.updateUser({ email });
  }

  handleSubmitPassword(event) {
    event.preventDefault();

    const currentPassword = event.target.currentPassword.value;
    const newPassword = event.target.newPassword.value;
    const confirmNewPassword = event.target.confirmNewPassword.value;

    this.setState(() => ({
      currentPasswordError: null,
      newPasswordError: null,
      confirmNewPasswordError: null,
    }));

    if (!currentPassword) {
      return this.setState(() => ({ currentPasswordError: 'Please enter your current password' }));
    }

    if (!newPassword) {
      return this.setState(() => ({ newPasswordError: 'Please enter your new password' }));
    }

    if (newPassword !== confirmNewPassword) {
      return this.setState(() => ({ confirmNewPasswordError: 'Passwords do not match' }));
    }

    return this.props.updateUser({ password: newPassword });
  }

  render() {
    const {
      emailError,
      currentPasswordError,
      newPasswordError,
      confirmNewPasswordError,
    } = this.state;
    const {
      isSaving,
      user,
    } = this.props;

    return (
      <div className="UserSettings-container">
        <Grid>
          <Row>
            <Col sm={12}>
              <div className="UserSettings-fullName">{user.fullName}</div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <form onSubmit={this.handleSubmitEmail}>
                <FormGroup controlId="email" validationState={emailError && 'error'}>
                  <ControlLabel>Current Email</ControlLabel>
                  <FormControl disabled type="text" defaultValue={user.email} />
                  <HelpBlock>{emailError}</HelpBlock>
                </FormGroup>
                {/* uncomment when changing email is implemented
                <Button type="submit">Change Email</Button>
                */}
              </form>
            </Col>
            <Col md={6}>
              <form onSubmit={this.handleSubmitPassword}>
                <FormGroup controlId="currentPassword" validationState={currentPasswordError && 'error'}>
                  <ControlLabel>Current Password</ControlLabel>
                  <FormControl type="password" disabled={isSaving} />
                  <HelpBlock>{currentPasswordError}</HelpBlock>
                </FormGroup>
                <FormGroup controlId="newPassword" validationState={newPasswordError && 'error'}>
                  <ControlLabel>New Password</ControlLabel>
                  <FormControl type="password" disabled={isSaving} />
                  <HelpBlock>{newPasswordError}</HelpBlock>
                </FormGroup>
                <FormGroup controlId="confirmNewPassword" validationState={confirmNewPasswordError && 'error'}>
                  <ControlLabel>Confirm New Password</ControlLabel>
                  <FormControl type="password" disabled={isSaving} />
                  <HelpBlock>{confirmNewPasswordError}</HelpBlock>
                </FormGroup>
                <Button type="submit">Submit Password</Button>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSaving: state.users.isSaving,
    user: state.userSession.user || {},
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUser: (...args) => dispatch(updateUser(...args)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);
