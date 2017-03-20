import { getStore } from '../util/storeAccessor';

export const subscribeToPresence = (atomId, atomType) => {
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

export const enterPresence = (atomId, atomType) => {
  const store = getStore();
  const presenceClient = store.getState().presenceClient;
  const presence = store.getState().presence;
  if(presence !== null) {
    presenceClient.enter(`${atomType}-${atomId}`, 'document');
  } else {
    throw new Error('No Presence connection found');
  }
};

const updatePresence = (presence) => {
  const store = getStore();

  store.dispatch({
      type:       'PRESENCE_UPDATE_RECEIVE',
      presence:   presence,
      receivedAt: Date.now()
  });
};
