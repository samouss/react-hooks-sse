import React from 'react';
// import PropTypes from 'prop-types';
import { useSSE } from 'react-hook-sse';

const Comments = () => {
  const last = useSSE('comments');

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
