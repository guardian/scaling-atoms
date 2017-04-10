import {applyMiddleware, compose, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {browserHistory} from 'react-router';
import {rootReducer} from '../reducers/rootReducer.js';
import {routerMiddleware} from 'react-router-redux';

import {
  updateUrlFromStateChangeMiddleware,
  updateStateFromUrlChangeMiddleware
} from './storeMiddleware.js';


export function configureStore() {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunkMiddleware),
      applyMiddleware(routerMiddleware(browserHistory)),
      applyMiddleware(updateUrlFromStateChangeMiddleware),
      applyMiddleware(updateStateFromUrlChangeMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  /* globals module:false */
  if (module.hot) {
    module.hot.accept('../reducers/rootReducer.js', () => {
        store.replaceReducer(rootReducer);
    });
  }

  return store;
}