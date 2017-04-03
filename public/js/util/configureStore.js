import { compose, createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import stateToUriParams from '../middleware/stateToUriParams';

import {rootReducer} from '../reducers/rootReducer.js';

const createStoreWithMiddleware = compose(
    applyMiddleware(
        thunkMiddleware,
        stateToUriParams
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default function configureStore(initialState) {

  const store = createStoreWithMiddleware(rootReducer, initialState);

  //Hot Reloading code
  /* global module:false */
  if (module.hot) {
    module.hot.accept('../reducers/rootReducer.js', () => {
      store.replaceReducer(rootReducer);
    });
  }

  return store;
}
