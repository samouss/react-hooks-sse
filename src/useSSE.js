import { useContext, useReducer, useEffect } from 'react';
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
  const [value, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    const listener = event => {
      const data = parser(event.data);

      dispatch({
        event,
        data,
      });
    };

    source.addEventListener(eventName, listener);

    return () => {
      source.removeEventListener(eventName, listener);
    };
  }, []);

  return value;
};
