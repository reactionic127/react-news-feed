import {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
} from '../actions/users';

const initialState = {
  isFetching: false,
  isSaving: false,
  user: null,
  errorMessage: null,
};

export function users(state = initialState, action) {
  if (action.type === CREATE_USER_REQUEST) {
    return {
      ...state,
      isFetching: true,
    };
  }

  if (action.type === CREATE_USER_SUCCESS) {
    return {
      ...state,
      isFetching: false,
      user: action.payload.data.user,
    };
  }

  if (action.type === CREATE_USER_FAILURE) {
    return {
      ...state,
      isFetching: false,
      user: null,
      errorMessage: action.payload.errorMessage,
    };
  }

  if (action.type === UPDATE_USER_REQUEST) {
    return {
      ...state,
      isSaving: true,
    };
  }

  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isSaving: false,
      user: action.payload.data.user,
    };
  }

  if (action.type === UPDATE_USER_FAILURE) {
    return {
      ...state,
      isSaving: false,
      errorMessage: action.payload.errorMessage,
    };
  }

  return state;
}
