export default function suggestionsForLatestContent(state = null, action) {
  switch (action.type) {

    case 'SUGGESTIONS_FOR_LATEST_CONTENT_RECEIVE':
      return action.suggestionsForLatestContent || null;

    default:
      return state;
  }
}
