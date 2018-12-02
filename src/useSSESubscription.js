import { useContext, useState, useEffect } from 'react';
import { SSEContext } from './SSEContext';

export const useSSESubscription = (
  eventName,
  {
    initialState = null,
    stateReducer = (_, changes) => changes,
    parser = data => JSON.parse(data),
  } = {}
) => {
  const source = useContext(SSEContext);
  const [value, setValue] = useState(initialState);

  useEffect(
    () => {
      const listener = event => {
        const data = parser(event.data);

        setValue(previousValue =>
          stateReducer(previousValue, {
            event,
            data,
          })
        );
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
