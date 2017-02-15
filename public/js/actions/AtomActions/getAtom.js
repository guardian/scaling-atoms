import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';


function requestAtom(id, atomType) {
  return {
    type:       'ATOM_GET_REQUEST',
    id:         id,
    atomType:   atomType,
    receivedAt: Date.now()
  };
}

function receiveAtom(atom) {
  return {
    type:       'ATOM_GET_RECEIVE',
    atom:       atom,
    receivedAt: Date.now()
  };
}

function errorReceivingAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function getAtom(id, atomType) {
  return dispatch => {
    dispatch(requestAtom(id, atomType));
    return AtomsApi.getAtom(id, atomType)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtom(atom));
        })
        .catch(error => dispatch(errorReceivingAtom(error)));
  };
}
