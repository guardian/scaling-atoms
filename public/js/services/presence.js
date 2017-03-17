import { getStore } from '../util/storeAccessor';

export const subscribeToPresence = (atomId, atomType) => {
  const store = getStore();
  const presenceClient = store.getState().presenceClient;
  if (Object.keys(presenceClient).length !== 0) {
    presenceClient.startConnection();

    presenceClient.on("connection.open", () => {
      presenceClient.subscribe(`${atomType}-${atomId}`);
      enterPresence(atomId, atomType);
    });

    presenceClient.on('visitor-list-updated', presence => updatePresence(presence));
  }
};

export const enterPresence = (atomId, atomType) => {
  const store = getStore();
  const presenceClient = store.getState().presenceClient;
  presenceClient.enter(`${atomType}-${atomId}`, 'document');
};

const updatePresence = (presence) => {
  const store = getStore();

  store.dispatch({
      type:       'PRESENCE_UPDATE_RECEIVE',
      presence:   presence,
      receivedAt: Date.now()
  });
};
