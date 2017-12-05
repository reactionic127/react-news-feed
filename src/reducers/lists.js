import {
  GET_LISTS_REQUEST,
  GET_LISTS_SUCCESS,
  GET_LISTS_FAILURE,

  UPDATE_LIST_REQUEST,
  UPDATE_LIST_SUCCESS,
  UPDATE_LIST_FAILURE,

  GET_UPLOAD_SESSION_REQUEST,
  GET_UPLOAD_SESSION_SUCCESS,
  GET_UPLOAD_SESSION_FAILURE,

  FETCH_IMAGE_REQUEST,
  FETCH_IMAGE_SUCCESS,
  FETCH_IMAGE_FAILURE
} from '../actions/lists';

const initialState = {
  isLoading: false,
  isFetching: false,
  isSaving: false,
  list: null,
  errorMessage: null,
  uploadSession: null,
  lists: null,
  imageUrl: null
};

export function lists(state = initialState, action) {
  if (action.type === GET_LISTS_REQUEST) {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === GET_LISTS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      lists: action.payload.entities.lists,
    };
  }

  if (action.type === GET_LISTS_FAILURE) {
    return {
      ...state,
      isLoading: false,
      errorMessage: action.payload.errorMessage,
    };
  }

  if (action.type === UPDATE_LIST_REQUEST) {
    return {
      ...state,
      isSaving: true,
    };
  }

  if (action.type === UPDATE_LIST_SUCCESS) {
    return {
      ...state,
      isSaving: false,
      list: action.payload.data.user,
    };
  }

  if (action.type === UPDATE_LIST_FAILURE) {
    return {
      ...state,
      isSaving: false,
      list: null,
      errorMessage: action.payload.errorMessage,
    };
  }

  if (action.type === GET_UPLOAD_SESSION_REQUEST) {
    return {
      ...state,
      isFetching: true,
    };
  }

  if (action.type === GET_UPLOAD_SESSION_SUCCESS) {
    return {
      ...state,
      isFetching: false,
      uploadSession: action.payload.data,
    };
  }

  if (action.type === GET_UPLOAD_SESSION_FAILURE) {
    return {
      ...state,
      isFetching: false,
      uploadSession: null,
      errorMessage: action.payload.errorMessage,
    };
  }

  if (action.type === FETCH_IMAGE_REQUEST) {
    return {
      ...state,
      isFetching: true,
    };
  }

  if (action.type === FETCH_IMAGE_SUCCESS) {
    return {
      ...state,
      isFetching: false,
      imageUrl: action.payload.data
    };
  }

  if (action.type === FETCH_IMAGE_FAILURE) {
    return {
      ...state,
      isFetching: false,
      imageUrl: null,
      errorMessage: action.payload.errorMessage,
    };
  }

  return state;
}
