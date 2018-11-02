import React from 'react';
import { useSSESubscription } from './lib';

const createSSEComponent = ({ event, label, emoji }) => () => {
  const [last] = useSSESubscription(event);

  return (
    <p>
      <span role="img" aria-label={label}>
        {emoji}
      </span>{' '}
      {last ? last.data.value : '...'}
    </p>
  );
};

export default createSSEComponent;
