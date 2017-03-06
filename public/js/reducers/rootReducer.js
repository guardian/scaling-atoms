import {combineReducers } from 'redux';

import config from '../reducers/configReducer';
import error from '../reducers/errorReducer';
import atom from '../reducers/atomReducer';
import saveState from '../reducers/saveStateReducer';
import atomList from '../reducers/atomListReducer';
import atomUsages from '../reducers/atomUsagesReducer';

export const rootReducer = combineReducers({
  config,
  error,
  atom,
  saveState,
  atomList,
  atomUsages
});
