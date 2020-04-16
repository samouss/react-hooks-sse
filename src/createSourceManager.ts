type Listener = () => void;

type State = {
  source: EventSource | null;
  listenersByName: Map<string, Set<Listener>>;
};

export type SourceManagerOptions = {
  endpoint: string;
  options?: EventSourceInit;
};

export type SourceManager = {
  getState(): State;
  addEventListener(name: string, listener: Listener): void;
  removeEventListener(name: string, listener: Listener): void;
};

export const createSourceManager = ({
  endpoint,
  options = {},
}: SourceManagerOptions): SourceManager => {
  const state: State = {
    source: null,
    listenersByName: new Map(),
  };

  return {
    getState() {
      return state;
    },
    addEventListener(name, listener) {
      if (!state.listenersByName.size) {
        state.source = new window.EventSource(endpoint, options);
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
