import URLSearchParams from 'url-search-params';

export default function extractQueryParamsFromUrl() {
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
        queryParams[newKey] = new Array(pair[1]);
      }
    } else {
      queryParams[pair[0]] = pair[1];
    }
  }
  return queryParams;
}