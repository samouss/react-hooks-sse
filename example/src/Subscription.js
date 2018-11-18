import React from 'react';
// import PropTypes from 'prop-types';
import { useSSESubscription } from './lib';

const Subscription = ({ event, label, emoji }) => {
  const last = useSSESubscription(event);

  return (
    <p>
      <span role="img" aria-label={label}>
        {emoji}
      </span>{' '}
      {last ? last.data.value : '...'}
    </p>
  );
};

export default Subscription;
