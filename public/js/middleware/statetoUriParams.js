import {browserHistory} from 'react-router';
import { queryParamsToUrlParams } from '../util/queryParamHelpers';

export default function stateToUriParams() {
  return (next) => 
    (action) => {
      if(action.type == "ATOM_LIST_GET_REQUEST") {
        browserHistory.push(`?${queryParamsToUrlParams(action.queryParams)}`);
      }
      return next(action);
    };
}