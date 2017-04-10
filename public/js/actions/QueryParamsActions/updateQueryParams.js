export function updateQueryParams(queryParams) {
    return {
        type:       'QUERYPARAMS_UPDATE',
        queryParams: queryParams,
        receivedAt:  Date.now()
    };
}