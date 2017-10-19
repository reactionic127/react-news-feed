import { Observable } from 'rxjs/Observable';
// import { push } from 'react-router-redux';

function someOtherActionSuccess(orgId) {
  return {
    type: 'SOME_OTHER_ACTION_SUCCESS',
    orgId,
  };
}

export const testEpic = (action$) => {
  return action$.ofType('SOME_OTHER_ACTION_REQUEST')
    .delay(1000)
    .map(action => action.payload.orgId)
    .mergeMap(
      (orgId) => Observable.merge(
        Observable.of(someOtherActionSuccess(orgId)),
        // Observable.timer(5000).map(() => push('/')),
      ),
    );
};
