export default function externalAtom(state = null, action) {
  switch (action.type) {

    case 'EXTERNAL_ATOM_GET_RECEIVE':
      return action.externalAtom || false;

    default:
      return state;
  }
}
