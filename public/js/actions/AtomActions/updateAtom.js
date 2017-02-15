import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';

function requestAtomUpdate(atom) {
  return {
    type:       'ATOM_UPDATE_REQUEST',
    atom:       atom,
    receivedAt: Date.now()
  };
}

function receiveAtomUpdate(atom) {
  return {
    type:       'ATOM_UPDATE_RECEIVE',
    atom:       atom,
    receivedAt: Date.now()
  };
}

function errorUpdatingAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not update atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function updateAtom(atom) {
  return dispatch => {
    dispatch(requestAtomUpdate(atom));
    return AtomsApi.updateAtom(atom)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtomUpdate(atom));
        })
        .catch(error => dispatch(errorUpdatingAtom(error)));
  };
}
