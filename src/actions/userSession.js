import { DEBUT_URL } from '../config';

export const CREATE_USER_SESSION_REQUEST = 'CREATE_USER_SESSION_REQUEST';
export const CREATE_USER_SESSION_SUCCESS = 'CREATE_USER_SESSION_SUCCESS';
export const CREATE_USER_SESSION_FAILURE = 'CREATE_USER_SESSION_FAILURE';

export const DELETE_USER_SESSION_SUCCESS = 'DELETE_USER_SESSION_SUCCESS';

export function createUserSessionRequest() {
  return {
    type: CREATE_USER_SESSION_REQUEST,
  };
}

export function createUserSessionSuccess(data) {
  return {
    type: CREATE_USER_SESSION_SUCCESS,
    payload: {
      data,
    },
  };
}

export function createUserSesssionError(errorMessage) {
  return {
    type: CREATE_USER_SESSION_FAILURE,
    payload: {
      errorMessage,
    },
  };
}

export function deleteUserSessionSuccess() {
  return {
    type: DELETE_USER_SESSION_SUCCESS,
  };
}

// Relies on Redux Thunk middleware.
export const createUserSession = (email, password) => async (dispatch) => {
  dispatch(createUserSessionRequest());

  try {
    const response = await fetch(`${DEBUT_URL}/api/users/${email}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
      }),
    });

    const { errors, data } = await response.json();

    if (errors && errors.length > 0) {
      const serverError = errors[0];
      throw new Error(serverError.message);
    }

    dispatch(createUserSessionSuccess(data));
  } catch (error) {
    dispatch(createUserSesssionError(error.message));
  }
}
