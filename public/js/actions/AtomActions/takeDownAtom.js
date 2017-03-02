import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';


function requestAtomTakeDown(atom) {
  return {
    type:       'ATOM_TAKE_DOWN_REQUEST',
    atom:        atom,
    receivedAt: Date.now()
  };
}

function receiveAtomTakeDown(atom) {
  return {
    type:       'ATOM_TAKE_DOWN_RECEIVE',
    atom:       atom,
    receivedAt: Date.now()
  };
}

function errorTakingDownAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not take down atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function takeDownAtom(atom) {
  return dispatch => {
    dispatch(requestAtomTakeDown(atom));
    return AtomsApi.takeDownAtom(atom)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtomTakeDown(atom));
        })
        .catch(error => dispatch(errorTakingDownAtom(error)));
  };
}
