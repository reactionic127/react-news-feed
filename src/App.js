/*
  redux-observable does not automatically add every RxJS operator to
  the Observable prototype. Because there are many ways to add them,
  our examples will not include any imports. If you want to add every
  operator, put import 'rxjs'; in your entry index.js.
  More info: https://github.com/ReactiveX/rxjs#installation-and-usage
 */
import 'rxjs';
import React from 'react';
import { Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate, getStoredState } from 'redux-persist';
import { createEpicMiddleware, combineEpics } from 'redux-observable';
import { asyncSessionStorage } from 'redux-persist/storages';
import { Provider } from 'react-redux';

/* redux reducers */
import { reducer as formReducer } from 'redux-form';

/* redux middleware */
import thunk from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';
import api from './middleware/api';

/* redux reducers */
import { newsletters } from './reducers/newsletters';
import { users } from './reducers/users';
import { lists } from './reducers/lists';
import { emailSessionVerification } from './reducers/emailSessionVerification';
import { userSession } from './reducers/userSession';
import { entities } from './reducers/entities';

/* components */
import EmailLogin from './components/EmailLogin/EmailLogin';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/LogIn/LogIn';
import Newsletter from './components/Newsletter/Newsletter';
import ListSettings from './components/ListSettings/ListSettings';
import Conversations from './components/Conversations/Conversations';
import UserSettings from './components/UserSettings/UserSettings';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import SignUp from './components/SignUp/SignUp';

/* epics */
import { testEpic } from './epics/testEpic';

import './App.css';

const rootReducer = combineReducers({
  // signup: signupStatus,
  newsletters,

  users,
  lists,
  entities,
  userSession,
  emailSessionVerification,
  // 3rd party
  router: routerReducer,
  form: formReducer,
});

const rootEpic = combineEpics(
  testEpic
);

const history = createHistory();
const router = routerMiddleware(history);
// const logger = createLogger();
const epicMiddleware = createEpicMiddleware(rootEpic);

const _compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = initialState => createStore(
  rootReducer,
  initialState,
  _compose(
    // applyMiddleware(epicMiddleware, thunk, api, router, logger),
    applyMiddleware(epicMiddleware, thunk, api, router),
    autoRehydrate({ log: true }),
 ),
);

const persistConfig = {
  whitelist: ['userSession'],
  storage: asyncSessionStorage,
};

const appReady = (cb) => {
  // redux-persist/issues/21
  getStoredState(persistConfig, (err, restoredState) => {
    const store = configureStore(restoredState);
    persistStore(store, persistConfig);

    const DebutApp = () => (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Header />
            <Route exact path="/login" component={Login} />
            <Route exact path="/login/:action/:token" component={EmailLogin} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forgot" component={ForgotPassword} />

            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute
              exact
              path="/lists/:listId/newsletters/:newsletterId?"
              component={Newsletter}
            />
      			<PrivateRoute
              exact
              path="/messages/:newsletterId?/:conversationId?"
              component={Conversations}
            />
            <PrivateRoute
              exact
              path="/lists/:listId/listsetting"
              component={ListSettings}
      			/>
            <PrivateRoute
              exact
              path="/settings"
              component={UserSettings}
            />
          </div>
        </ConnectedRouter>
      </Provider>
    );

    cb(DebutApp);
  });
};

export default appReady;
