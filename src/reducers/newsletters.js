import {
  NEWSLETTER_SAVE_REQUEST,
  NEWSLETTER_SAVE_SUCCESS,
  NEWSLETTER_SAVE_FAILURE,
  NEWSLETTER_LOADED,
  UPDATE_NEWSLETTER_REQUEST,
  UPDATE_NEWSLETTER_SUCCESS,
  UPDATE_NEWSLETTER_FAILURE,
} from '../actions/newsletters';

const initialState = {
  isFetching: false,
  isSaving: false,
  newsletters: [],
};

export function newsletters(state = initialState, action) {
  if (action.type === NEWSLETTER_SAVE_REQUEST) {
    return {
      ...state,
      isSaving: true,
      updateState: false,
      errorMessage: false,
    };
  }

  if (action.type === NEWSLETTER_SAVE_SUCCESS) {
    if (action.isNew) {
      return {
        ...state,
        isSaving: false,
        newsletters: [...state.newsletters, action.newsletter],
        newsletter_created: action.newsletter,
      };
    }
    return {
      ...state,
      isSaving: false,
      newsletters: state.newsletters.map(newsletter => {
        if (newsletter.id === action.newsletter.id) {
          return action.newsletter;
        }
        return newsletter;
      }),
      updateState: true,
    };
  }

  if (action.type === NEWSLETTER_LOADED) {
    return {
      ...state,
      newsletter_created: false,
    };
  }

  if (action.type === NEWSLETTER_SAVE_FAILURE) {
    return {
      ...state,
      isSaving: action.isSaving,
      errorMessage: action.message,
    };
  }

  if (action.type === UPDATE_NEWSLETTER_REQUEST) {
    return {
      ...state,
      isSaving: true,
    };
  }
  if (action.type === UPDATE_NEWSLETTER_SUCCESS) {
    return {
      ...state,
      isSaving: false,
    };
  }
  if (action.type === UPDATE_NEWSLETTER_FAILURE) {
    return {
      ...state,
      isSaving: false,
    };
  }

  return state;
}
