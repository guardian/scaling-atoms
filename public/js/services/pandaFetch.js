import { reEstablishSession } from 'panda-session';
import { getStore } from '../util/storeAccessor';

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    throw res;
  }
}


export function pandaFetch(requestBody) {
  return new Promise(function(resolve, reject) {
    fetch(requestBody)
        .then(checkStatus)
        .then(res => resolve(res))
        .catch(err => {
          if (err.status == 419) {
            const store = getStore();
            var reauthUrl = store.getState().config.reauthUrl;

            reEstablishSession(reauthUrl, 5000).then(
                () => {
                  fetch(requestBody)
                  .then(checkStatus)
                  .then(res => resolve(res))
                  .catch(err => reject(err));
                },
                error => {
                  throw error;
                });

          } else {
            reject(err);
          }
        });
  });
}
