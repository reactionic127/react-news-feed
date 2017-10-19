import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { confirmEmailSessionVerification } from '../../actions/emailSessionVerification';

class EmailLogin extends Component {
  render() {
    const { dispatch, match, emailSessionVerification } = this.props;
    const action = match.params.action;
    const extractedToken = match.params.token;

    if (!['reset', 'verify'].includes(action)) {
      return <div><Redirect to="/" /></div>;
    }

    if (
      !emailSessionVerification.isFetching &&
      !emailSessionVerification.isVerified &&
      !emailSessionVerification.errorMessage
    ) {
      dispatch(confirmEmailSessionVerification(extractedToken));
    }

    return (
      <div className="centered">
        <h3>
          {emailSessionVerification.isFetching && <div>Verifying</div>}
          {!emailSessionVerification.isFetching &&
            emailSessionVerification.errorMessage &&
            <div>{emailSessionVerification.errorMessage}</div>}
          {emailSessionVerification.isVerified &&
            action === 'reset' &&
            <div><Redirect to="/password/change" /></div>}
          {emailSessionVerification.isVerified &&
            action === 'verify' &&
            <div>
              Verification Successful.<br />
              Please, <Link to="/">sign in</Link> to continue.
            </div>}
        </h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    emailSessionVerification: state.emailSessionVerification,
  };
}

export default connect(mapStateToProps)(EmailLogin);
