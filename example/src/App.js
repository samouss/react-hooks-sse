import React from 'react';
import useSSE from './useSSE';
import './App.css';

const App = () => {
  const events = useSSE('http://localhost:8080/sse', {
    withCredentials: false,
  });

  return (
    <div className="App">
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.data.timestamp}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
