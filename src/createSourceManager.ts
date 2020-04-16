type Listener = () => void;

type State = {
  source: EventSource | null;
  listenersByName: Map<string, Set<Listener>>;
};

type Options = {
  endpoint: string;
  options?: EventSourceInit;
};

export const createSourceManager = ({ endpoint, options = {} }: Options) => {
  const state: State = {
    source: null,
    listenersByName: new Map(),
  };

  return {
    getState() {
      return state;
    },
    addEventListener(name: string, listener: Listener) {
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
    removeEventListener(name: string, listener: Listener) {
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
