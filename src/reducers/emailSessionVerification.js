import {
  CONFIRM_EMAIL_SESSION_VERIFICATION_REQUEST,
  CONFIRM_EMAIL_SESSION_VERIFICATION_SUCCESS,
  CONFIRM_EMAIL_SESSION_VERIFICATION_FAILURE,
  FORGOT_SUCCESS,
  FORGOT_REQUEST,
  FORGOT_FAILURE,
} from '../actions/emailSessionVerification';

const initialState = {
  isFetching: false,
  isVerified: false,
  verificationSessionEmailSent: false,
  errorMessage: null,
};

export function emailSessionVerification(state = initialState, action) {
  if (action.type === CONFIRM_EMAIL_SESSION_VERIFICATION_REQUEST) {
    return {
      ...state,
      isFetching: true,
      isVerified: false,
      errorMessage: null,
    };
  }

  if (action.type === CONFIRM_EMAIL_SESSION_VERIFICATION_SUCCESS) {
    return {
      ...state,
      isFetching: false,
      isVerified: true,
      errorMessage: null,
    };
  }

  if (action.type === CONFIRM_EMAIL_SESSION_VERIFICATION_FAILURE) {
    return {
      ...initialState,
      errorMessage: action.payload.errorMessage,
    };
  }

  if (action.type === FORGOT_REQUEST) {
    return {
      isFetching: true,
      errorMessage: false,
      verificationSessionEmailSent: false,
    };
  }

  if (action.type === FORGOT_SUCCESS) {
    return {
      ...state,
      isFetching: false,
      verificationSessionEmailSent: action.verificationSessionEmailSent,
    };
  }

  if (action.type === FORGOT_FAILURE) {
    return {
      ...state,
      isFetching: false,
      errorMessage: action.message,
    };
  }


  return state;
}
