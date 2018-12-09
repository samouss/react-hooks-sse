import { createElement, createContext, useState } from 'react';
import { string, bool, shape } from 'prop-types';
import { createEventSourceManager } from './createEventSourceManager';

export const SSEContext = createContext(null);

export const SSEConsumer = SSEContext.Consumer;

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

SSEProvider.propTypes = {
  endpoint: string.isRequired,
  options: shape({
    withCredentials: bool.isRequired,
  }),
};

SSEProvider.defaultProps = {
  options: {
    withCredentials: false,
  },
};
