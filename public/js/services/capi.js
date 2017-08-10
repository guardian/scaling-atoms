import { pandaFetch } from './pandaFetch';
import { uriEncodeParams, sanitiseQuery } from '../util/uriEncodeParams';


export const searchTags = (searchText, type = null) => {
  return pandaFetch(
    `/support/previewCapi/tags?q=${searchText}${type ? `&type=${type}` : ''}`,
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
    `/support/previewCapi/atom/${atomType.toLowerCase()}/${atomId}`,
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
    `/support/previewCapi/atom/${atomType.toLowerCase()}/${atomId}/usage`,
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
    return Promise.resolve(json.response.content);
  });
};

export const getContentByTags = (tags, atomType) => {
  const date = new Date(new Date().setDate(new Date().getDate()-7));
  return pandaFetch(
    `/support/previewCapi/search?tag=${tags.join(',')}&show-atoms=${atomType}&show-fields=all&from-date=${date.toISOString()}`,
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

const TWENTY_FOUR_HOURS_IN_MS = 86400 * 1000;

export const getLatestContent = () => {
  const date = new Date(Date.now() - TWENTY_FOUR_HOURS_IN_MS);
  return pandaFetch(
    `/support/previewCapi/search?show-tags=keyword&tag=tone/news&show-atoms=all&show-fields=internalComposerCode,headline&from-date=${date.toISOString()}`,
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
