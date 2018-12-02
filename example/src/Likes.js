import React from 'react';
// import PropTypes from 'prop-types';
import { useSSESubscription } from 'react-hook-sse';

const Likes = () => {
  const state = useSSESubscription('likes', {
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
