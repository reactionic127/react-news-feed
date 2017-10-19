import { DEBUT_URL } from '../config';
import { CALL_API, Schemas } from '../middleware/api';

export const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST';
export const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS';
export const GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE';
export const POST_MESSAGE_REQUEST = 'POST_MESSAGE_REQUEST';
export const POST_MESSAGE_SUCCESS = 'POST_MESSAGE_SUCCESS';
export const POST_MESSAGE_FAILURE = 'POST_MESSAGE_FAILURE';

// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchMessages = (orgId, conversationId) => ({
  [CALL_API]: {
    types: [GET_MESSAGES_REQUEST, GET_MESSAGES_SUCCESS, GET_MESSAGES_FAILURE],
    endpoint: `${DEBUT_URL}/api/orgs/${orgId}/conversations/${conversationId}/messages`,
    schema: Schemas.MESSAGES_RESPONSE,
  },
});

// Relies on Redux Thunk middleware.
export const loadMessages = (orgId, conversationId) => (dispatch) => {
  dispatch(fetchMessages(orgId, conversationId));
};

export const createNewMessage = (orgId, conversationId, text) => async (dispatch, getState) => {
  dispatch({ type: POST_MESSAGE_REQUEST });

  try {
    const { token } = getState().userSession;
    const response = await fetch(`${DEBUT_URL}/api/orgs/${orgId}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });

    const { errors, data } = await response.json();

    if (errors && errors.length > 0) {
      const serverError = errors[0];
      throw new Error(serverError.message);
    }

    dispatch({ type: POST_MESSAGE_SUCCESS, payload: { data } });
    dispatch(fetchMessages(orgId, conversationId));
  } catch (error) {
    dispatch({ type: POST_MESSAGE_FAILURE });
  }
};
