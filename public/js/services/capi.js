import { pandaFetch } from './pandaFetch';
import { uriEncodeParams } from '../util/uriEncodeParams';


export const searchTags = (searchText) => {
  return pandaFetch(
    `/support/previewCapi/tags?q=${searchText}`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => Promise.resolve(json.response.results));
};

export const sanitiseQuery = (query) => {
  return Object.keys(query)
  .filter(k => (query[k] && query[k].length != 0))
  .reduce( (res, key) => (res[key] = query[key], res), {} );
};

export const searchAtoms = (query) => {
  return pandaFetch(
    `/support/previewCapi/atoms?${uriEncodeParams(this.sanitiseQuery(query))}`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => Promise.resolve(json.response.results));
};

export const fetchAtomUsages = (atomId, atomType) => {
  return pandaFetch(
    `/support/previewCapi/atom/${atomType}/${atomId}/usage`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => {
    return Promise.resolve(json.response.results);
  });
};

export const getByPath = (path) => {
  return pandaFetch(
    `/support/previewCapi/${path}?show-fields=all`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => {
    return Promise.resolve(json.response.results);
  });
};
