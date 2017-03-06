import capi from '../../services/capi';
import {logError} from '../../util/logger';


function requestAtomUsages(id, atomType) {
  return {
    type:       'ATOM_USAGES_GET_REQUEST',
    id:         id,
    atomType:   atomType,
    receivedAt: Date.now()
  };
}

function receiveAtomUsages(atomUsages) {
  return {
    type:       'ATOM_USAGES_GET_RECEIVE',
    atomUsages: atomUsages,
    receivedAt: Date.now()
  };
}

function errorReceivingAtomUsages(error) {
  logError(error);
  return {
    type:       'SHOW_ERROR',
    message:    'Could not get atom usages',
    error:      error,
    receivedAt: Date.now()
  };
}

export function getAtomUsages(atomId, atomType) {
  return dispatch => {
    dispatch(requestAtomUsages());
    return capi.getAtomUsages(atomId, atomType)
    .then(res => {

      // the atom usage endpoint in capi only returns article paths,
      // lookup the articles in capi to get their fields
      Promise.all(res.map(capi.getByPath))
        .then(capiResponse => {
          const usages = capiResponse.reduce((all, item) => {
            all.push(item.response.content);
            return all;
          }, []);

          // sort by article creation date DESC
          usages.sort((first, second) => new Date(second.fields.creationDate) - new Date(first.fields.creationDate));

          dispatch(receiveAtomUsages(usages));
        });
    })
    .catch(error => {
      dispatch(errorReceivingAtomUsages(error));
    });
  };
}
