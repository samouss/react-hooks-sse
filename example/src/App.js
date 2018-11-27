import React, { useState } from 'react';
import { SSEProvider } from './lib';
import Likes from './Likes';
import Comments from './Comments';
import './App.css';

const App = () => {
  const [showLikes, setShowLikes] = useState(true);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="App">
      <h1>React hook SSE</h1>
      <SSEProvider endpoint="http://localhost:8080/sse">
        <div>
          <button onClick={() => setShowLikes(previous => !previous)}>
            Toggle "Likes"
          </button>
          {showLikes && <Likes />}
        </div>
        <br />
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
