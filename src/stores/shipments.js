import { writable } from 'svelte/store';

function handleShipments() {
  const { subscribe, update, set } = writable([]);
  return {
    subscribe,
    add: data => update(store => store = [...store, data]),
    remove: uid => update(store => {
      const filtered = store.filter(item => item.uid !== uid);
      return store = filtered;
    })
  }
}

export const shipments = handleShipments();