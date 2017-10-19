import {
  // create
  CREATE_USER_SESSION_REQUEST,
  CREATE_USER_SESSION_SUCCESS,
  CREATE_USER_SESSION_FAILURE,
  // delete
  DELETE_USER_SESSION_SUCCESS,
} from '../actions/userSession';

const initialState = {
  isFetching: false,
  token: null,
  org: null,
  user: null,
  errorMessage: null,
};

export function userSession(state = initialState, action) {
  if (action.type === CREATE_USER_SESSION_REQUEST) {
    return {
      ...state,
      isFetching: true,
      errorMessage: null,
    };
  }

  if (action.type === CREATE_USER_SESSION_SUCCESS) {
    const { user, org, token } = action.payload.data;

    return {
      ...state,
      isFetching: false,
      token,
      user,
      org,
    };
  }

  if (action.type === CREATE_USER_SESSION_FAILURE) {
    return {
      ...initialState,
      errorMessage: action.payload.errorMessage,
    };
  }

  if (action.type === DELETE_USER_SESSION_SUCCESS) {
    return {
      ...initialState,
    };
  }

  return state;
}
