export default function presence(state = {}, action) {
  switch (action.type) {

    case 'PRESENCE_STARTED':
      return action.presence || {};

    default:
      return state;
  }
}
