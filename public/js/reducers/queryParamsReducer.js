export default function queryParams(state = {}, action) {
  switch (action.type) {

    case 'URLPARAMS_UPDATE':
      return action.queryParams;

    default:
      return state;
  }
}