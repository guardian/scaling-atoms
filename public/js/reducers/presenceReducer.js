export default function presence(state = null, action) {
  switch (action.type) {

    case 'PRESENCE_UPDATE_RECEIVE':
      return action.presence || false;

    default:
      return state;
  }
}
