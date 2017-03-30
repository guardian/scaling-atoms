export const uriEncodeParams = (params) => {
    return Object.keys(params)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
};

export const sanitiseQuery = (query) => {
  return Object.keys(query)
  .filter(k => (query[k] && query[k].length != 0))
  .reduce( (res, key) => (res[key] = query[key], res), {} );
};