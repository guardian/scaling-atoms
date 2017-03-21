import {combineReducers } from 'redux';

import config from '../reducers/configReducer';
import presenceClient from '../reducers/presenceClientReducer';
import presence from '../reducers/presenceReducer';
import error from '../reducers/errorReducer';
import atom from '../reducers/atomReducer';
import saveState from '../reducers/saveStateReducer';
import atomList from '../reducers/atomListReducer';
import atomUsages from '../reducers/atomUsagesReducer';
import externalAtom from '../reducers/externalAtomReducer';

export const rootReducer = combineReducers({
  config,
  presenceClient,
  presence,
  error,
  atom,
  saveState,
  atomList,
  atomUsages,
  externalAtom
});
