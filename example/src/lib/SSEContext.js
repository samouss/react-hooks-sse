import React, { createContext } from 'react';
// import { string, boolean, shape } from 'prop-types';

export const SSEContext = createContext(null);

export const SSEConsumer = SSEContext.Consumer;

export const SSEProvider = ({ endpoint, options, ...props }) => {
  // @TODO: enable one time created event
  // Create a new source on each render
  // - useEffect with state
  const source = new EventSource(endpoint, options);

  return <SSEContext.Provider {...props} value={source} />;
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
