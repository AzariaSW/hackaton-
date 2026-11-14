// MOCKED — in-memory Map store for AI Studio compatibility
const store = new Map();

export const redis = {
  get: async (k) => store.get(k) ?? null,
  set: async (k, v) => {
    store.set(k, v);
    return 'OK';
  },
  del: async (k) => store.delete(k),
  incr: async (k) => {
    const n = (Number(store.get(k)) || 0) + 1;
    store.set(k, n);
    return n;
  },
  quit: async () => 'OK',
  on: () => {},
};
