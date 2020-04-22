import React from 'react';
import { useSSE } from 'react-hooks-sse';

type State = {
  count: number | null;
  lastChange: number | null;
};

type Message = {
  value: number;
};

const Likes = () => {
  const state = useSSE<State, Message>(
    'likes',
    {
      count: null,
      lastChange: null,
    },
    {
      stateReducer(prevState, action) {
        return {
          count: action.data.value,
          lastChange:
            prevState.count !== null
              ? action.data.value - prevState.count
              : null,
        };
      },
      parser(input) {
        return JSON.parse(input);
      },
    }
  );

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
