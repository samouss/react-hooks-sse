import React, { useState } from 'react';
import { SSEProvider } from './lib';
import Subscription from './Subscription';
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
          {showLikes && <Subscription event="likes" label="Likes" emoji="👍" />}
        </div>
        <br />
        <div>
          <button onClick={() => setShowComments(previous => !previous)}>
            Toggle "Comments"
          </button>
          {showComments && (
            <Subscription event="comments" label="Comments" emoji="💬" />
          )}
        </div>
      </SSEProvider>
    </div>
  );
};

export default App;
