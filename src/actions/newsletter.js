import { loadLists } from './lists';
import { loadNewsletters } from './newsletters';

export const loadNewsletter = (orgId, listId) => {
  return dispatch => Promise.all([
    dispatch(loadLists(orgId)),
    dispatch(loadNewsletters(orgId, listId)),
  ]);
};
