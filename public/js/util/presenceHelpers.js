import { getStore } from '../util/storeAccessor';

export const connectPresenceToAtom = () => {
  const store = getStore();
  const presence = store.getState().presence;
  const atom = store.getState().atom || {};

  if(atom) {
    presence.startConnection();
    presence.on('connection.open', function() {
        presence.subscribe(`${atom.atomType}-${atom.id}`);
        presence.enter(`${atom.atomType}-${atom.id}`, document);
    });
  }
};
