import capi from '../../services/capi';
import {logError} from '../../util/logger';


function requestAtomList(searchParams) {
    return {
        type:         'ATOM_LIST_GET_REQUEST',
        searchParams: searchParams,
        receivedAt:   Date.now()
    };
}

function receiveAtomList(atomList) {
    return {
        type:       'ATOM_LIST_GET_RECEIVE',
        atomList:   atomList,
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

export function getAtomList(searchParams) {
    return dispatch => {
        dispatch(requestAtomList(searchParams));
        return capi.searchAtoms(searchParams)
            .then(atomList => dispatch(receiveAtomList(atomList)))
            .catch(error => dispatch(errorReceivingAtomList(error)));
    };
}
