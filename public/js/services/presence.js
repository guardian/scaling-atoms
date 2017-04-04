import { getStore } from '../util/storeAccessor';
import {logError} from '../util/logger';

export const subscribeToPresence = (atomType, atomId) => {
  const store = getStore();
  const presenceClient = store.getState().presenceClient;
  if (Object.keys(presenceClient).length !== 0) {
    presenceClient.startConnection();

    presenceClient.on("connection.open", () => {
      presenceClient.subscribe(`${atomType}-${atomId}`);
      presenceClient.enter(`${atomType}-${atomId}`, 'document');
    });

    presenceClient.on('visitor-list-updated', presence => updatePresence(presence));
  }
};

export const enterPresence = (atomType, atomId) => {
  const store = getStore();
  const presenceClient = store.getState().presenceClient;
  presenceClient.enter(`${atomType}-${atomId}`, 'document')
    .catch(err => logError(err));
};

const updatePresence = (presence) => {
  const store = getStore();

  store.dispatch({
      type:       'PRESENCE_UPDATE_RECEIVE',
      presence:   presence,
      receivedAt: Date.now()
  });
};
