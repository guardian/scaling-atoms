import {combineReducers } from 'redux';

import config from '../reducers/configReducer';
import presenceClient from '../reducers/presenceClientReducer';
import presence from '../reducers/presenceReducer';
import error from '../reducers/errorReducer';
import formErrors from '../reducers/formErrorsReducer';
import atom from '../reducers/atomReducer';
import saveState from '../reducers/saveStateReducer';
import atomList from '../reducers/atomListReducer';
import atomUsages from '../reducers/atomUsagesReducer';
import suggestedContent from '../reducers/suggestedContentReducer';
import suggestionsForLatestContent from '../reducers/suggestionsForLatestContent';
import externalAtom from '../reducers/externalAtomReducer';
import queryParams from '../reducers/queryParamsReducer';
import workflow from '../reducers/workflowReducer';
import commonsDivisions from '../reducers/commonsDivisionsReducer';
import {routerReducer} from 'react-router-redux';

export const rootReducer = combineReducers({
  config,
  presenceClient,
  presence,
  error,
  formErrors,
  atom,
  saveState,
  atomList,
  atomUsages,
  suggestedContent,
  suggestionsForLatestContent,
  externalAtom,
  queryParams,
  workflow,
  commonsDivisions,
  routing: routerReducer
});
