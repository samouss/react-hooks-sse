import { createElement, createContext, useState } from 'react';
// import { string, boolean, shape } from 'prop-types';

export const SSEContext = createContext(null);

export const SSEConsumer = SSEContext.Consumer;

const createEventSourceManager = ({ endpoint, options }) => {
  const state = {
    source: null,
    listenersByName: new Map(),
  };

  return {
    addEventListener(name, listener) {
      if (!state.listenersByName.size) {
        state.source = new EventSource(endpoint, options);
      }

      const listeners = state.listenersByName.get(name) || new Set();

      listeners.add(listener);

      state.listenersByName.set(name, listeners);

      state.source.addEventListener(name, listener);
    },
    removeEventListener(name, listener) {
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

export const SSEProvider = ({ endpoint, options, ...props }) => {
  const [source] = useState(() =>
    createEventSourceManager({
      endpoint,
      options,
    })
  );

  return createElement(SSEContext.Provider, {
    ...props,
    value: source,
  });
};

// @TODO: enable props
// SSEProvider.propTypes = {
//   endpoint: string.isRequired,
//   options: shape({
//     withCredentials: boolean.isRequired,
//   }),
// };

// SSEProvider.defaultProps = {
//   options: {
//     withCredentials: false,
//   },
// };
