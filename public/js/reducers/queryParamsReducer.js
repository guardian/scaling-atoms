export default function queryParams(state = {}, action) {
  switch (action.type) {

    case 'QUERYPARAMS_UPDATE':
      return action.queryParams;

    default:
      return state;
  }
}