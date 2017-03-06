

export default function atomList(state = null, action) {
    switch (action.type) {

        case 'ATOM_LIST_GET_RECEIVE':
            return action.atomList || [];

        default:
            return state;
    }
}
