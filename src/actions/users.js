import { DEBUT_URL } from '../config';

export const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';
export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

function createUserRequest() {
  return {
    type: CREATE_USER_REQUEST,
  };
}

function createUserSuccess(data) {
  return {
    type: CREATE_USER_SUCCESS,
    payload: {
      data,
    },
  };
}

function createUserError(errorMessage) {
  return {
    type: CREATE_USER_FAILURE,
    payload: {
      errorMessage,
    },
  };
}

function updateUserRequest() {
  return {
    type: UPDATE_USER_REQUEST,
  };
}

function updateUserSuccess(data) {
  return {
    type: UPDATE_USER_SUCCESS,
    payload: {
      data,
    },
  };
}

function updateUserError(errorMessage) {
  return {
    type: UPDATE_USER_FAILURE,
    payload: {
      errorMessage,
    },
  };
}

export const createUser = ({ company, email, password, fullName }) => async (dispatch) => {
  dispatch(createUserRequest());

  try {
    const response = await fetch(`${DEBUT_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company,
        email,
        password,
        fullName,
      }),
    });

    const { errors, data } = await response.json();

    if (errors && errors.length > 0) {
      const serverError = errors[0];
      throw new Error(serverError.message);
    }

    dispatch(createUserSuccess(data));
  } catch (error) {
    dispatch(createUserError(error.message));
  }
};

export const updateUser = ({ email, password }) => async (dispatch, getState) => {
  dispatch(updateUserRequest());

  try {
    const existingUserId = getState().userSession.user.id;
    const { token } = getState().userSession;
    const response = await fetch(`${DEBUT_URL}/api/users/${existingUserId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const { errors, data } = await response.json();

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    dispatch(updateUserSuccess(data));
  } catch (error) {
    dispatch(updateUserError(error.message));
  }
};
