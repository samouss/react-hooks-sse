import { useState, useEffect } from 'react';

const useSSE = (endpoint, params) => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    const source = new EventSource(endpoint, params);

    source.addEventListener('time', event => {
      const data = JSON.parse(event.data);

      setValue(previousValue => {
        return previousValue.concat({
          id: event.lastEventId,
          data,
        });
      });
    });

    return () => {
      source.close();
    };
  }, []);

  return value;
};

export default useSSE;
