import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';


function requestAtom(atomType, id) {
  return {
    type:       'ATOM_GET_REQUEST',
    atomType:   atomType,
    id:         id,
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

export function getAtom(atomType, id) {
  return dispatch => {
    dispatch(requestAtom(atomType, id));
    return AtomsApi.getAtom(atomType, id)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtom(atom));
        })
        .catch(error => dispatch(errorReceivingAtom(error)));
  };
}
