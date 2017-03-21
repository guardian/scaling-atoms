import {fetchCapiAtom} from '../../services/capi';
import {logError} from '../../util/logger';


function requestExternalAtom(atomType, id) {
  return {
    type:       'EXTERNAL_ATOM_GET_REQUEST',
    atomType:   atomType,
    id:         id,
    receivedAt: Date.now()
  };
}

function receiveExternalAtom(externalAtom) {
  return {
    type:       'EXTERNAL_ATOM_GET_RECEIVE',
    externalAtom: externalAtom,
    receivedAt: Date.now()
  };
}

function errorReceivingExternalAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get external atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function getExternalAtom(atomType, id) {
  return dispatch => {
    dispatch(requestExternalAtom(atomType, id));
    return fetchCapiAtom(atomType, id)
        .then(res => {
          dispatch(receiveExternalAtom(res));
        })
        .catch(error => dispatch(errorReceivingExternalAtom(error)));
  };
}
