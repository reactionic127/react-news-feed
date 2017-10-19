import { normalize, schema as normalizerSchema } from 'normalizr';

import { DEBUT_URL } from '../config';
import { deleteUserSessionSuccess } from '../actions/userSession';

const API_ROOT = DEBUT_URL;

export const CALL_API = 'Call API';

// Fetches an API response and normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = async (token, endpoint, schema) => {
  const fullUrl = endpoint.indexOf(API_ROOT) === -1
    ? API_ROOT + endpoint
    : endpoint;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw response; // return Promise.reject(body);
  }

  return normalize(body, schema);
};

const listSchema = new normalizerSchema.Entity(
  'lists',
  {},
  {
    idAttribute: list => list.id,
  },
);

const listsResponseSchema = new normalizerSchema.Object({
  data: {
    lists: new normalizerSchema.Array(listSchema),
  },
});

const newsletterSchema = new normalizerSchema.Entity(
  'newsletters',
  {},
// {
//   owner: userSchema,
// },
  {
    idAttribute: newsletter => newsletter.id,
  },
);

const newslettersResponseSchema = new normalizerSchema.Object({
  data: {
    newsletters: new normalizerSchema.Array(newsletterSchema),
  },
});

const conversationSchema = new normalizerSchema.Entity(
  'conversations',
  {},
  {
    idAttribute: list => list.id,
  },
);

const conversationsResponseSchema = new normalizerSchema.Object({
  data: {
    conversations: new normalizerSchema.Array(conversationSchema),
  },
});

const messageSchema = new normalizerSchema.Entity(
  'messages',
  {},
  {
    idAttribute: list => list.id,
  },
);

const messagesResponseSchema = new normalizerSchema.Object({
  data: {
    messages: new normalizerSchema.Array(messageSchema),
  },
});

export const Schemas = {
  LISTS_RESPONSE: listsResponseSchema,
  NEWSLETTERS_RESPONSE: newslettersResponseSchema,
  CONVERSATIONS_RESPONSE: conversationsResponseSchema,
  MESSAGES_RESPONSE: messagesResponseSchema,
};

export default store => next => async (action) => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { schema, types } = callAPI;

  const state = store.getState();

  if (typeof endpoint === 'function') {
    endpoint = endpoint(state);
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = (data) => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  const token = state.userSession.token;

  try {
    const payload = await callApi(token, endpoint, schema);
    return next(actionWith({ payload, type: successType }));
  } catch (error) {
    if (error.status === 401) {
      return next(deleteUserSessionSuccess());
    }

    const errorMessage = error.message || 'Something bad happened';
    return next(actionWith({ type: failureType, error: errorMessage }));
  }
};
