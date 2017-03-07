import {combineReducers } from 'redux';

import config from '../reducers/configReducer';
import presence from '../reducers/presenceReducer';
import error from '../reducers/errorReducer';
import atom from '../reducers/atomReducer';
import saveState from '../reducers/saveStateReducer';
import atomList from '../reducers/atomListReducer';
import atomUsages from '../reducers/atomUsagesReducer';

export const rootReducer = combineReducers({
  config,
  presence,
  error,
  atom,
  saveState,
  atomList,
  atomUsages
});
