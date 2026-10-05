// Keep the existing key and schema so saved owner records survive the refactor.
export const STORE_KEY = "rt-business-desk-v1";

export function createStore(storage) {
  let state;
  try {
    state = Object.assign(
      { inventory: [], sales: [] },
      JSON.parse(storage.getItem(STORE_KEY)) || {},
    );
  } catch {
    state = { inventory: [], sales: [] };
  }
  return {
    state,
    save() {
      storage.setItem(STORE_KEY, JSON.stringify(state));
    },
  };
}
