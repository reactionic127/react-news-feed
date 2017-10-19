import { DEBUT_URL } from '../config';
import { CALL_API, Schemas } from '../middleware/api';

export const GET_NEWSLETTERS_REQUEST = 'GET_NEWSLETTERS_REQUEST';
export const GET_NEWSLETTERS_SUCCESS = 'GET_NEWSLETTERS_SUCCESS';
export const GET_NEWSLETTERS_FAILURE = 'GET_NEWSLETTERS_FAILURE';
export const CREATE_NEWSLETTER_REQUEST = 'CREATE_NEWSLETTER_REQUEST';
export const CREATE_NEWSLETTER_SUCCESS = 'CREATE_NEWSLETTER_SUCCESS';
export const CREATE_NEWSLETTER_FAILURE = 'CREATE_NEWSLETTER_FAILURE';
export const UPDATE_NEWSLETTER_REQUEST = 'UPDATE_NEWSLETTER_REQUEST';
export const UPDATE_NEWSLETTER_SUCCESS = 'UPDATE_NEWSLETTER_SUCCESS';
export const UPDATE_NEWSLETTER_FAILURE = 'UPDATE_NEWSLETTER_FAILURE';

const EMPTY_EDITOR_STATE = {
  nodes: [{
    kind: 'block',
    type: 'paragraph',
    nodes: [{ kind: 'text', text: '' }],
  }],
};

// Relies on the custom API middleware defined in ../middleware/api.js.
const fetchNewsletters = (orgId, listId) => ({
  [CALL_API]: {
    types: [GET_NEWSLETTERS_REQUEST, GET_NEWSLETTERS_SUCCESS, GET_NEWSLETTERS_FAILURE],
    endpoint: `${DEBUT_URL}/api/orgs/${orgId}/lists/${listId}/newsletters`,
    schema: Schemas.NEWSLETTERS_RESPONSE,
  },
});

// Relies on Redux Thunk middleware.
export const loadNewsletters = (orgId, listId) => (dispatch) => {
  dispatch(fetchNewsletters(orgId, listId));
};

export const createNewsletter = (orgId, listId, newsletter) => async (dispatch, getState) => {
  dispatch({ type: CREATE_NEWSLETTER_REQUEST });

  try {
    const { token } = getState().userSession;
    const response = await fetch(`${DEBUT_URL}/api/orgs/${orgId}/lists/${listId}/newsletters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: {
          ...newsletter.content,
          snippets: newsletter.content.snippets.map(snippet => ({
            body: snippet.body,
          })),
        },
      }),
    });
    const { data } = await response.json();

    dispatch({
      type: CREATE_NEWSLETTER_SUCCESS,
      payload: {
        entities: {
          newsletters: {
            [data.newsletter.id]: data.newsletter,
          },
        },
      },
    });

    return data.newsletter.id;
  } catch (error) {
    dispatch({ type: CREATE_NEWSLETTER_FAILURE, error });
  }
};

export const updateNewsletter = (orgId, listId, newsletterId, newsletter) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_NEWSLETTER_REQUEST });

  try {
    const { token } = getState().userSession;
    const response = await fetch(`${DEBUT_URL}/api/orgs/${orgId}/lists/${listId}/newsletters/${newsletterId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: newsletter.content,
        // publishAt: convert(LocalDateTime.parse('2017-05-03T10:00')).toDate().getTime(),
        // previewAt: convert(LocalDateTime.parse('2017-05-03T10:00')).toDate().getTime(),
      }),
    });

    dispatch({ type: UPDATE_NEWSLETTER_SUCCESS });
  } catch (error) {
    dispatch({ type: UPDATE_NEWSLETTER_FAILURE, error });
  }
};
