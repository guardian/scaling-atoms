import { pandaFetch } from './pandaFetch';
import { uriEncodeParams, sanitiseQuery } from '../util/uriEncodeParams';


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

export const searchAtoms = (query) => {
  return pandaFetch(
    `/support/previewCapi/atoms?${uriEncodeParams(sanitiseQuery(query))}`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => Promise.resolve(json.response.results));
};

export const fetchCapiAtom = (atomType, atomId) => {
  return pandaFetch(
    `/support/previewCapi/atom/${atomType}/${atomId}`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((res) => {
    return Promise.resolve(res.response[atomType]);
  });
};

export const fetchAtomUsages = (atomType, atomId) => {
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
