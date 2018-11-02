import { useContext, useState, useEffect } from 'react';
import { SSEContext } from './SSEContext';

export const useSSESubscription = eventName => {
  const source = useContext(SSEContext);
  const [value, setValue] = useState([]);

  useEffect(() => {
    const listener = event => {
      const data = JSON.parse(event.data);

      setValue(previousValue => {
        return [
          {
            id: event.lastEventId,
            data,
          },
          ...previousValue,
        ];
      });
    };

    source.addEventListener(eventName, listener);

    return () => {
      source.removeEventListener(eventName, listener);
    };
  }, []);

  return value;
};
