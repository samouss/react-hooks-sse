import React from 'react';
// import PropTypes from 'prop-types';
import { useSSE } from 'react-hooks-sse';

const Likes = () => {
  const state = useSSE('likes', {
    initialState: {
      count: null,
      lastChange: null,
    },
    stateReducer(prevState, changes) {
      return {
        count: changes.data.value,
        lastChange:
          prevState.count !== null
            ? changes.data.value - prevState.count
            : null,
      };
    },
  });

  return (
    <p>
      <span role="img" aria-label="Likes">
        👍
      </span>{' '}
      {state.count ? state.count : '...'}
      {state.lastChange !== null && ` (+${state.lastChange})`}
    </p>
  );
};

export default Likes;
