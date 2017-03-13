import Presence from '../../services/presence';
import {logError} from '../../util/logger';

function requestPresenceUpdate(presence) {
  return {
    type:       'PRESENCE_UPDATE_REQUEST',
    atomType:   atomType,
    receivedAt: Date.now()
  };
}

function receiveAtomCreate(atom) {
  return {
    type:       'ATOM_CREATE_RECEIVE',
    atom:       atom,
    receivedAt: Date.now()
  };
}

function errorCreatingAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not create atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function createAtom(atomType, atomInfo) {
  return dispatch => {
    dispatch(requestAtomCreate(atomType));
    return AtomsApi.createAtom(atomType, atomInfo)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtomCreate(atom));
          browserHistory.push(`/atoms/${atom.atomType}/${atom.id}/edit`);
        })
        .catch(error => dispatch(errorCreatingAtom(error)));
  };
}
