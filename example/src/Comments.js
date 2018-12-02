import React from 'react';
// import PropTypes from 'prop-types';
import { useSSESubscription } from 'react-hook-sse';

const Comments = () => {
  const last = useSSESubscription('comments');

  return (
    <p>
      <span role="img" aria-label="Comments">
        💬
      </span>{' '}
      {last ? last.data.value : '...'}
    </p>
  );
};

export default Comments;
