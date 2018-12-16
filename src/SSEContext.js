import { createElement, createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createSourceManager } from './createSourceManager';

export const SSEContext = createContext(null);

export const SSEConsumer = SSEContext.Consumer;

export const SSEProvider = ({ endpoint, options, ...props }) => {
  const [source] = useState(() =>
    createSourceManager({
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
  endpoint: PropTypes.string.isRequired,
  options: PropTypes.shape({
    withCredentials: PropTypes.bool.isRequired,
  }),
};

SSEProvider.defaultProps = {
  options: {
    withCredentials: false,
  },
};
