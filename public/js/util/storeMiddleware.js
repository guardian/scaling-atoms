import {replace} from 'react-router-redux';
import _isEqual from 'lodash/isEqual';

import {objectToParamString, paramStringToObject} from './UrlParameters';

export const updateUrlFromStateChangeMiddleware = ({dispatch, getState}) => (next) => (action) => {
  const prevState = getState();
  let result = next(action);
  const newState = getState();
  if (!_isEqual(prevState.queryParams, newState.queryParams)) {
    const location = newState.routing.locationBeforeTransitions;
    const paramString = `?${objectToParamString(newState.queryParams)}`;

    if (location && paramString !== location.search) {
      const newLocation = Object.assign({}, location, {
        search: paramString || ''
      });
      const updateAction = replace(newLocation);
      dispatch(updateAction);
    }
  }

  return result;
};

export const updateStateFromUrlChangeMiddleware = ({dispatch, getState}) => (next) => (action) => {

  next(action);
  const newState = getState();

  if (action.type === "@@router/LOCATION_CHANGE") {
    const urlSearchParams = paramStringToObject(newState.routing.locationBeforeTransitions.search);
    if (!_isEqual(urlSearchParams, newState.queryParams)) {
      dispatch({
        type: "URLPARAMS_UPDATE",
        queryParams: urlSearchParams,
        receivedAt: Date.now()
      });
    }
  }
};