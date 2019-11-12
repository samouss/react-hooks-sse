import { createElement, createContext } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { useSSE } from '../useSSE';

describe('useSSE', () => {
  const createFakeSource = () => {
    const state = new Map();

    return {
      addEventListener: jest.fn((name, listener) => {
        const listeners = state.get(name) || [];

        state.set(name, listeners.concat(listener));
      }),
      removeEventListener: jest.fn((name, listener) => {
        const listeners = state.get(name);

        state.set(
          name,
          listeners.filter(x => x !== listener)
        );
      }),
      simulate: (eventName, value) =>
        state.get(eventName).forEach(listener => listener(value)),
    };
  };

  const createFakeContext = source => createContext(source);

  const FakeApp = ({ eventName, children = () => {}, ...options }) => {
    const state = useSSE(eventName, options);

    return createElement('div', {}, children(state));
  };

  it('expect to `useSSE` with the default options', () => {
    const children = jest.fn();
    const source = createFakeSource();
    const context = createFakeContext(source);

    TestRenderer.create(
      createElement(FakeApp, {
        children,
        context,
      })
    );

    expect(children).toHaveBeenCalledWith(null);
  });

  it('expect to `useSSE` with the provided `initialState`', () => {
    const children = jest.fn();
    const source = createFakeSource();
    const context = createFakeContext(source);

    TestRenderer.create(
      createElement(FakeApp, {
        initialState: 10,
        children,
        context,
      })
    );

    expect(children).toHaveBeenCalledWith(10);
  });

  describe('subscription', () => {
    it('expect to register a listener on mount', () => {
      const eventName = 'push';
      const source = createFakeSource();
      const context = createFakeContext(source);

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            context,
          })
        );
      });

      expect(source.addEventListener).toHaveBeenCalledTimes(1);
      expect(source.addEventListener).toHaveBeenCalledWith(
        eventName,
        expect.any(Function)
      );
    });

    it('expect to not register a listener on update', () => {
      const eventName = 'push';
      const source = createFakeSource();
      const context = createFakeContext(source);
      const renderer = TestRenderer.create();
      const mockCreateElement = jest.fn(() =>
        createElement(FakeApp, {
          eventName,
          context,
        })
      );

      const createFakeApp = () => mockCreateElement();

      act(() => {
        renderer.update(createFakeApp());
      });

      expect(mockCreateElement).toHaveBeenCalledTimes(1);
      expect(source.addEventListener).toHaveBeenCalledTimes(1);

      act(() => {
        renderer.update(createFakeApp());
        renderer.update(createFakeApp());
        renderer.update(createFakeApp());
      });

      expect(mockCreateElement).toHaveBeenCalledTimes(4);
      expect(source.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('expect to remove the listener on unmount', () => {
      const eventName = 'push';
      const source = createFakeSource();
      const context = createFakeContext(source);
      const renderer = TestRenderer.create();

      act(() => {
        renderer.update(
          createElement(FakeApp, {
            eventName,
            context,
          })
        );
      });

      act(() => {
        renderer.unmount();
      });

      expect(source.removeEventListener).toHaveBeenCalledTimes(1);
      expect(source.removeEventListener).toHaveBeenCalledWith(
        eventName,
        expect.any(Function)
      );
    });
  });

  describe('updater', () => {
    it('expect to parse the value with the default JSON parser', () => {
      const eventName = 'push';
      const children = jest.fn();

      const initialState = {
        data: {
          value: null,
        },
      };

      const source = createFakeSource();
      const context = createFakeContext(source);

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            initialState,
            children,
            context,
          })
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 'earth',
          }),
        });
      });

      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: {
            value: 'earth',
          },
        })
      );
    });

    it('expect to parse the value with a provided parser', () => {
      const eventName = 'push';
      const children = jest.fn();
      const initialState = { data: 5 };
      const parser = x => parseInt(x, 10);

      const source = createFakeSource();
      const context = createFakeContext(source);

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            initialState,
            parser,
            children,
            context,
          })
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: '10',
        });
      });

      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: 10,
        })
      );
    });

    it('expect to call the stateReducer with state, data and event', () => {
      const eventName = 'push';
      const stateReducer = jest.fn((state, action) => action);

      const source = createFakeSource();
      const context = createFakeContext(source);

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            stateReducer,
            context,
          })
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 10,
          }),
        });
      });

      expect(stateReducer).toHaveBeenLastCalledWith(null, {
        data: {
          value: 10,
        },
        event: {
          data: JSON.stringify({
            value: 10,
          }),
        },
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 20,
          }),
        });
      });

      expect(stateReducer).toHaveBeenLastCalledWith(
        {
          data: {
            value: 10,
          },
          event: {
            data: JSON.stringify({
              value: 10,
            }),
          },
        },
        {
          data: {
            value: 20,
          },
          event: {
            data: JSON.stringify({
              value: 20,
            }),
          },
        }
      );
    });

    it('expect to return the value from the default stateReducer', () => {
      const eventName = 'push';
      const children = jest.fn();

      const source = createFakeSource();
      const context = createFakeContext(source);

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            children,
            context,
          })
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 10,
          }),
        });
      });

      expect(children).toHaveBeenLastCalledWith(
        expect.objectContaining({
          data: {
            value: 10,
          },
        })
      );
    });

    it('expect to return the value from the provided stateReducer', () => {
      const eventName = 'push';
      const children = jest.fn();

      const initialState = {
        value: 'first',
        previous: null,
      };

      const stateReducer = (state, action) => ({
        value: action.data.value,
        previous: state.value,
      });

      const source = createFakeSource();
      const context = createFakeContext(source);

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            initialState,
            stateReducer,
            children,
            context,
          })
        );
      });

      expect(children).toHaveBeenLastCalledWith({
        value: 'first',
        previous: null,
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 'second',
          }),
        });
      });

      expect(children).toHaveBeenLastCalledWith({
        value: 'second',
        previous: 'first',
      });
    });
  });
});
