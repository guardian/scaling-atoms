export default function atom(state = null, action) {
  switch (action.type) {

    case 'ATOM_GET_RECEIVE':
      return action.atom || false;

    case 'ATOM_CREATE_RECEIVE':
      return action.atom || false;

    case 'ATOM_UPDATE_REQUEST':
      return action.atom || false;

    case 'ATOM_PUBLISH_REQUEST':
      return action.atom || false;

    default:
      return state;
  }
}
