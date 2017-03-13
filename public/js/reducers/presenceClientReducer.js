export default function presenceClient(state = {}, action) {
  switch (action.type) {

    case 'PRESENCE_CLIENT_STARTED':
      return action.presenceClient || {};

    default:
      return state;
  }
}
