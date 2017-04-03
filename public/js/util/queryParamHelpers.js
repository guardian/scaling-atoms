import URLSearchParams from 'url-search-params';

export const extractQueryParamsFromUrl = () => {
  const urlParams = new URLSearchParams(document.location.search);
  const queryParams = {};
  for(var pair of urlParams.entries()) {
    // handling arrays formatted as key[]=value1&key[]=value2 ...
    if(pair[0].indexOf('[]') !== -1) {
      // Magic removal of those brackets
      var newKey = pair[0].slice(0, -2);
      if(queryParams[newKey]) {
        queryParams[newKey].push(pair[1]);
      } else {
        // URLSearchParams returns an empty string
        if(pair[1] === '') {
          queryParams[newKey] = new Array();
        } else {
          queryParams[newKey] = new Array(pair[1]);
        }
      }
    } else {
      queryParams[pair[0]] = pair[1];
    }
  }
  return queryParams;
};

export const queryParamsToUrlParams = (queryParams) => {
  const urlParams = new URLSearchParams();
  for (var key in queryParams) {
    // transform arrays to strings that can be read in extractQueryParamsFromUrl
    if(Array.isArray(queryParams[key])) {
      if(queryParams[key].length) {
        queryParams[key].map((val) => urlParams.append(`${key}[]`, val));
      } else {
        // ensures all params exist in state even if they're empty
        urlParams.append(`${key}[]`, queryParams[key]);
      }
    } else { 
      urlParams.append(key, queryParams[key]);
    }
  }
  return urlParams.toString();
};