import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';
import _debounce from 'lodash/fp/debounce';

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

function _updateAtom(dispatch, atom) {
  return AtomsApi.updateAtom(atom)
    .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtomUpdate(atom));
        })
        .catch(error => dispatch(errorUpdatingAtom(error)));
}

const _debouncedUpdate = _debounce(500, _updateAtom);

export function updateAtom(atom) {
  return dispatch => {
    dispatch(requestAtomUpdate(atom));
    return _debouncedUpdate(dispatch, atom);
  };
}

export function updateAtomInstant(atom) {
  return dispatch => {
    dispatch(requestAtomUpdate(atom));
    return _updateAtom(dispatch, atom);
  };
}