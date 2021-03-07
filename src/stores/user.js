import { writable } from 'svelte/store';

function handleUser() {
  const { subscribe, set, update } = writable(null);

  return {
    subscribe,
    login: currentUser => set(currentUser),
  }
}

export const user = handleUser();