export function updateQueryParams(queryParams) {
  return {
    type:        'QUERY_PARAMS_UPDATE_REQUEST',
    queryParams: queryParams,
    receivedAt:  Date.now()
  };
}
