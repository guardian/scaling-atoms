import { pandaFetch } from './pandaFetch';

export const latestCommonsDivisions = () => {
  return pandaFetch(
    'https://lda.data.parliament.uk/commonsdivisions.json',
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => Promise.resolve(json));
};

export const commonsDivision = (parliamentId) => {
  return pandaFetch(
    `https://lda.data.parliament.uk/commonsdivisions/${parliamentId}.json`,
    {
      method: 'get',
      credentials: 'same-origin'
    }
  )
    .then((res) => res.json())
    .then((json) => Promise.resolve(json));
};
