import { Source, Listener } from './source';

type State = {
  source: Source | null;
  listenersByName: Map<string, Set<Listener>>;
};

export type SourceManager = {
  addEventListener(name: string, listener: Listener): void;
  removeEventListener(name: string, listener: Listener): void;
};

export const createSourceManager = (
  createSource: () => Source
): SourceManager => {
  const state: State = {
    source: null,
    listenersByName: new Map(),
  };

  return {
    addEventListener(name, listener) {
      if (!state.listenersByName.size) {
        state.source = createSource();
      }

      if (!state.source) {
        throw new Error("The source doesn't exist");
      }

      const listeners = state.listenersByName.get(name) || new Set();

      listeners.add(listener);

      state.listenersByName.set(name, listeners);

      state.source.addEventListener(name, listener);
    },
    removeEventListener(name, listener) {
      if (!state.source) {
        throw new Error("The source doesn't exist");
      }

      const listeners = state.listenersByName.get(name) || new Set();

      listeners.delete(listener);

      if (!listeners.size) {
        state.listenersByName.delete(name);
      }

      state.source.removeEventListener(name, listener);

      if (!state.listenersByName.size) {
        state.source.close();
        state.source = null;
      }
    },
  };
};
