import React from 'react';
import { useSSE } from 'react-hooks-sse';

const Comments = () => {
  const last = useSSE('comments', {
    value: null,
  });

  return (
    <p>
      <span role="img" aria-label="Comments">
        💬
      </span>{' '}
      {last.value ? last.value : '...'}
    </p>
  );
};

export default Comments;
