export default function workflow(state={}, action) {

  switch (action.type) {
    case 'WORKFLOW_STATUS_GET_RECEIVE':
      return action.status || state;

    default:
      return state;
  }
}
