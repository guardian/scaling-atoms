export default function atom(state = null, action) {
  switch (action.type) {

    case 'ATOM_GET_RECEIVE':
      return action.atom || false;

    case 'ATOM_CREATE_RECEIVE':
      return action.atom || false;

    case 'ATOM_UPDATE_REQUEST':
      return action.atom || false;

    case 'ATOM_UPDATE_RECEIVE':
      return Object.assign({}, state, {
        contentChangeDetails: action.atom.contentChangeDetails
      }) || false;

    case 'ATOM_PUBLISH_RECEIVE':
      return Object.assign({}, state, {
        contentChangeDetails: action.atom.contentChangeDetails
      }) || false;

    case 'ATOM_TAKE_DOWN_RECEIVE':
      return Object.assign({}, state, {
        contentChangeDetails: action.atom.contentChangeDetails
      }) || false;

    case 'ATOM_DELETE_RECEIVE':
      return {} || false;

    case 'ATOM_CREATE_NOTIFICATION_RECEIVE':
      return action.atom || false;

    case 'ATOM_DELETE_NOTIFICATION_RECEIVE':
      return action.atom || false;

    default:
      return state;
  }
}
