import AtomsApi from '../../services/AtomsApi';
import {logError} from '../../util/logger';


function requestAtomPublish(atom) {
  return {
    type:       'ATOM_PUBLISH_REQUEST',
    atom:        atom,
    receivedAt: Date.now()
  };
}

function receiveAtomPublish(atom) {
  return {
    type:       'ATOM_PUBLISH_RECEIVE',
    atom:       atom,
    receivedAt: Date.now()
  };
}

function errorPublishingAtom(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not publish atom',
    error:      error,
    receivedAt: Date.now()
  };
}

export function publishAtom(atom) {
  return dispatch => {
    dispatch(requestAtomPublish(atom));
    return AtomsApi.publishAtom(atom)
        .then(res => res.json())
        .then(atom => {
          dispatch(receiveAtomPublish(atom));
        })
        .catch(error => dispatch(errorPublishingAtom(error)));
  };
}
