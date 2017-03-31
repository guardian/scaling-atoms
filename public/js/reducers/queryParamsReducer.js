export default function queryParams(state = null, action) {
  switch (action.type) {
    case 'QUERY_PARAMS_RECEIVED':
      return action.queryParams || [];

    case 'QUERY_PARAMS_UPDATE_REQUEST':
      return action.queryParams || [];

    default:
      return state;
  }
}
