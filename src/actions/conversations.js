import { DEBUT_URL } from '../config';
import { CALL_API, Schemas } from '../middleware/api';

export const GET_CONVERSATIONS_REQUEST = 'GET_CONVERSATIONS_REQUEST';
export const GET_CONVERSATIONS_SUCCESS = 'GET_CONVERSATIONS_SUCCESS';
export const GET_CONVERSATIONS_FAILURE = 'GET_CONVERSATIONS_FAILURE';

// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchConversations = (orgId, newsletterId) => ({
  [CALL_API]: {
    types: [GET_CONVERSATIONS_REQUEST, GET_CONVERSATIONS_SUCCESS, GET_CONVERSATIONS_FAILURE],
    endpoint: `${DEBUT_URL}/api/orgs/${orgId}/newsletters/${newsletterId}/conversations`,
    schema: Schemas.CONVERSATIONS_RESPONSE,
  },
});

// Relies on Redux Thunk middleware.
export const loadConversations = (orgId, newsletterId) => (dispatch) => {
  dispatch(fetchConversations(orgId, newsletterId));
};
