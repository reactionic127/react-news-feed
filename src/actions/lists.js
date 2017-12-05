import { DEBUT_URL } from '../config';
import { CALL_API, Schemas } from '../middleware/api';

export const GET_LISTS_REQUEST = 'GET_LISTS_REQUEST';
export const GET_LISTS_SUCCESS = 'GET_LISTS_SUCCESS';
export const GET_LISTS_FAILURE = 'GET_LISTS_FAILURE';

export const UPDATE_LIST_REQUEST = 'UPDATE_LIST_REQUEST';
export const UPDATE_LIST_SUCCESS = 'UPDATE_LIST_SUCCESS';
export const UPDATE_LIST_FAILURE = 'UPDATE_LIST_FAILURE';

// export const UPDATE_IMAGE_REQUEST = 'UPDATE_IMAGE_REQUEST';
// export const UPDATE_IMAGE_SUCCESS = 'UPDATE_IMAGE_SUCCESS';
// export const UPDATE_IMAGE_FAILURE = 'UPDATE_IMAGE_FAILURE';

export const GET_UPLOAD_SESSION_REQUEST = 'GET_UPLOAD_SESSION_REQUEST';
export const GET_UPLOAD_SESSION_SUCCESS = 'GET_UPLOAD_SESSION_SUCCESS';
export const GET_UPLOAD_SESSION_FAILURE = 'GET_UPLOAD_SESSION_FAILURE';

export const FETCH_IMAGE_REQUEST = 'FETCH_IMAGE_REQUEST';
export const FETCH_IMAGE_SUCCESS = 'FETCH_IMAGE_SUCCESS';
export const FETCH_IMAGE_FAILURE = 'FETCH_IMAGE_FAILURE';

// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchLists = orgId => ({
  [CALL_API]: {
    types: [GET_LISTS_REQUEST, GET_LISTS_SUCCESS, GET_LISTS_FAILURE],
    endpoint: `${DEBUT_URL}/api/orgs/${orgId}/lists`,
    schema: Schemas.LISTS_RESPONSE,
  },
});

function updateListRequest() {
  return {
    type: UPDATE_LIST_REQUEST,
  };
}

function updateListSuccess(data) {
  return {
    type: UPDATE_LIST_SUCCESS,
    payload: {
      data,
    },
  };
}

function updateListError(errorMessage) {
  return {
    type: UPDATE_LIST_FAILURE,
    payload: {
      errorMessage,
    },
  };
}

function fetchImageRequest() {
  return {
    type: FETCH_IMAGE_REQUEST,
  };
}

function fetchImageSuccess(data) {
  return {
    type: FETCH_IMAGE_SUCCESS,
    payload: {
      data,
    },
  };
}

function fetchImageError(errorMessage) {
  return {
    type: FETCH_IMAGE_FAILURE,
    payload: {
      errorMessage,
    },
  };
}

// Relies on Redux Thunk middleware.
export const loadLists = orgId => (dispatch) => {
  dispatch(fetchLists(orgId));
};

export const getAllLists = orgId => (dispatch, getState) => {
  dispatch(fetchLists(orgId));
};

export const updateList = ({ listId, orgId, name, isOnline, imageUrl }) => async (dispatch, getState) => {
  dispatch(updateListRequest());
  try {
    const { token } = getState().userSession;
    const response = await fetch(`${DEBUT_URL}/api/orgs/${orgId}/lists/${listId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        isOnline,
        imageUrl
      }),
    });
    const { errors, data } = await response.json();

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    dispatch(updateListSuccess(data));
  } catch (error) {
    dispatch(updateListError(error.message));
  }
};

export const fetchImageUrl = ({ file }) => async (dispatch, getState) => {
  dispatch(fetchImageRequest());
  try {
    const { token } = getState().userSession;
    const response = await fetch(`${DEBUT_URL}/api/upload-sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileType: 'image/png',
      }),
    });

    const { errors, data } = await response.json();

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message);
    }

    const {uploadSession} = data;
    const response1 = await fetch(`${uploadSession.signedUrl}`, {
      method: 'PUT',
      headers: {
        'content-type': uploadSession.fileType,
      },
      body: file
    });

    dispatch(fetchImageSuccess(response1.url));
  } catch (error) {
    dispatch(fetchImageError(error.message));
  }
};
