import { useContext, useState, useEffect } from 'react';
import { SSEContext } from './SSEContext';

export const useSSESubscription = eventName => {
  const source = useContext(SSEContext);
  const [value, setValue] = useState([]);

  useEffect(() => {
    source.addEventListener(eventName, event => {
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
