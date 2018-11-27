import { useContext, useState, useEffect } from 'react';
import { SSEContext } from './SSEContext';

export const useSSESubscription = (
  eventName,
  { initialState = null, stateReducer = (_, changes) => changes } = {}
) => {
  const source = useContext(SSEContext);
  const [value, setValue] = useState(initialState);

  useEffect(
    () => {
      const listener = event => {
        const data = JSON.parse(event.data);

        setValue(previousValue => {
          return stateReducer(previousValue, {
            id: event.lastEventId,
            data,
          });
        });
      };

      source.addEventListener(eventName, listener);

      return () => {
        source.removeEventListener(eventName, listener);
      };
    },
    [eventName]
  );

  return value;
};
