import { useContext, useState, useEffect } from 'react';
import { SSEContext } from './SSEContext';

export const useSSE = (
  eventName,
  {
    initialState = null,
    stateReducer = (_, changes) => changes,
    parser = data => JSON.parse(data),
    context = SSEContext,
  } = {}
) => {
  const source = useContext(context);
  const [value, setValue] = useState(initialState);

  useEffect(() => {
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
  }, []);

  return value;
};
