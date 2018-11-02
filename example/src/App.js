import React, { useState } from 'react';
import { SSEProvider } from './lib';
import createSSEComponent from './createSSEComponent';
import './App.css';

const Likes = createSSEComponent({
  event: 'likes',
  label: 'Likes',
  emoji: '👍',
});

const Comments = createSSEComponent({
  event: 'comments',
  label: 'Comments',
  emoji: '💬',
});

const App = () => {
  const [showLikes, setShowLikes] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="App">
      <SSEProvider endpoint="http://localhost:8080/sse">
        <div>
          <button onClick={() => setShowLikes(previous => !previous)}>
            Toggle "Likes"
          </button>
          {showLikes && <Likes />}
        </div>
        <div>
          <button onClick={() => setShowComments(previous => !previous)}>
            Toggle "Comments"
          </button>
          {showComments && <Comments />}
        </div>
      </SSEProvider>
    </div>
  );
};

export default App;
