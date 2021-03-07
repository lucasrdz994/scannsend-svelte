import { writable } from 'svelte/store';

function handleReport() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addAll: data => set(data),
    pushData: data => update(store => store = [...store, ...data])
  }
}

export const report = handleReport();