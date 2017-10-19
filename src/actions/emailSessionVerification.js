import { DEBUT_URL } from '../config';

export const CONFIRM_EMAIL_SESSION_VERIFICATION_REQUEST = 'CONFIRM_EMAIL_SESSION_VERIFICATION_REQUEST';
export const CONFIRM_EMAIL_SESSION_VERIFICATION_SUCCESS = 'CONFIRM_EMAIL_SESSION_VERIFICATION_SUCCESS';
export const CONFIRM_EMAIL_SESSION_VERIFICATION_FAILURE = 'CONFIRM_EMAIL_SESSION_VERIFICATION_FAILURE';

function confirmEmailSessionVerificationRequest() {
  return {
    type: CONFIRM_EMAIL_SESSION_VERIFICATION_REQUEST,
  };
}

function confirmEmailSessionVerificationSuccess() {
  return {
    type: CONFIRM_EMAIL_SESSION_VERIFICATION_SUCCESS,
  };
}

function confirmEmailSessionVerificationFailure(errorMessage) {
  return {
    type: CONFIRM_EMAIL_SESSION_VERIFICATION_FAILURE,
    payload: {
      errorMessage,
    },
  };
}

// Relies on Redux Thunk middleware.
export const confirmEmailSessionVerification = extractedToken => async (dispatch) => {
  dispatch(confirmEmailSessionVerificationRequest());

  try {
    const response = await fetch(`${DEBUT_URL}/api/authenticated-ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // use the token extracted from the verification URI
      Authorization: `Bearer ${extractedToken}`,
    });

    const { errors } = await response.json();

    if (errors && errors.length > 0) {
      const serverError = errors[0];
      throw new Error(serverError.message);
    }

    dispatch(confirmEmailSessionVerificationSuccess());
  } catch (error) {
    dispatch(confirmEmailSessionVerificationFailure(error));
  }
};

export const FORGOT_REQUEST = 'FORGOT_REQUEST';
export const FORGOT_SUCCESS = 'FORGOT_SUCCESS';
export const FORGOT_FAILURE = 'FORGOT_FAILURE';

export function requestForgot() {
  return {
    type: FORGOT_REQUEST,
    isFetching: true,
  };
}

export function receiveForgot() {
  return {
    type: FORGOT_SUCCESS,
    isFetching: false,
    verificationSessionEmailSent: true,
  };
}

export function forgotError(message) {
  return {
    type: FORGOT_FAILURE,
    isFetching: false,
    message,
  };
}

export function requestForgotPassword(email) {
  return (dispatch) => {
    dispatch(requestForgot());
    fetch(`${DEBUT_URL}/api/users/${email}/verification-sessions`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then((responseJson) => {
        if (responseJson.errors) {
          dispatch(forgotError(responseJson.errors[0].message));
        } else {
          dispatch(receiveForgot(responseJson));
        }
      })
      .catch((error) => {
        dispatch(forgotError(error));
      });
  };
}
