import {searchAtoms} from '../../services/capi';
import {logError} from '../../util/logger';


function requestAtomList(queryParams) {
    return {
        type:         'ATOM_LIST_GET_REQUEST',
        queryParams:  queryParams,
        receivedAt:   Date.now()
    };
}

function receiveAtomList(atomList, queryParams) {
    return {
        type:       'ATOM_LIST_GET_RECEIVE',
        atomList:    atomList,
        queryParams: queryParams,
        receivedAt: Date.now()
    };
}

function errorReceivingAtomList(error) {
    logError(error);
    return {
        type:       'SHOW_ERROR',
        message:    'Could not get atom LIST',
        error:      error,
        receivedAt: Date.now()
    };
}

export function getAtomList(queryParams) {
    return dispatch => {
        dispatch(requestAtomList(queryParams));
        return searchAtoms(queryParams)
            .then(atomList => dispatch(receiveAtomList(atomList, queryParams)))
            .catch(error => dispatch(errorReceivingAtomList(error)));
    };
}
