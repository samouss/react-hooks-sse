import React from 'react';
import { useSSE } from 'react-hooks-sse';

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
