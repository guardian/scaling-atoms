import { pandaFetch } from './pandaFetch';

export const mostViewed = () => {
  return pandaFetch(
    'https://dashboard.ophan.co.uk/api/mostread?count=20',
    {
        method: 'get',
        credentials: 'same-origin'
    }
  )
  .then((res) => res.json())
  .then((json) => Promise.resolve(json));
};
