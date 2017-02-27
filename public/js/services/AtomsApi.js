import { pandaFetch } from './pandaFetch';

export default {

  getAtom: (atomType, atomId) => {
    return pandaFetch(
      `/api/preview/${atomType}/${atomId}`,
      {
        method: 'get',
        credentials: 'same-origin'
      }
    );
  },


  createAtom: (atomType) => {
    return pandaFetch(
      `/api/preview/${atomType}`,
      {
        method: 'post',
        credentials: 'same-origin'
      }
    );
  },

  updateAtom: (atom) => {
    return pandaFetch(
      `/api/preview/${atom.atomType}/${atom.id}`,
      {
        method: 'put',
        credentials: 'same-origin',
        body: JSON.stringify(atom)
      }
    );
  }
};
