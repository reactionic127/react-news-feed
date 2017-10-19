import merge from 'lodash.merge';

export const RECEIVED_ENTITIES = 'RECEIVED_ENTITIES';

export const receivedEntities = payload => console.log(payload.entities) || ({
  type: RECEIVED_ENTITIES,
  payload,
});

const initialState = {
  lists: {},
  newsletters: {},
  conversations: {},
  messages: {},
};

export const entities = (state = initialState, action) => {
  if (action.payload && action.payload.entities) {
    return merge({}, state, action.payload.entities);
  }

  return state;
};

export default {
  entities,
};
