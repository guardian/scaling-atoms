export default function commonsDivisions(state = null, action) {
  switch (action.type) {

    case 'COMMONS_DIVISIONS_GET_RECEIVE':
      return action.commonsDivisions || null;

    default:
      return state;
  }
}
