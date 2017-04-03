export default function error(state = '', action) {
  switch (action.type) {
    case 'CLEAR_ERROR':
      return '';

    case 'SHOW_ERROR':
      return action.message;

    default:
      return state;
  }
}