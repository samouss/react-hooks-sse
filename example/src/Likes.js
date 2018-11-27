import React from 'react';
// import PropTypes from 'prop-types';
import { useSSESubscription } from './lib';

const Likes = () => {
  const last = useSSESubscription('likes');

  return (
    <p>
      <span role="img" aria-label="Likes">
        👍
      </span>{' '}
      {last ? last.data.value : '...'}
    </p>
  );
};

export default Likes;
