import { FC, createElement, createContext } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { SourceMock, createSourceMock } from '../__mocks__/source.mock';
import { SourceManager } from '../createSourceManager';
import { Options, useSSE } from '../useSSE';

describe('useSSE', () => {
  const createFakeContext = (source: SourceMock) =>
    createContext<SourceManager | null>(source);

  type State = {
    value: string;
  };

  type Props = Options<State> & {
    eventName: string;
    initialState: State;
  };

  const FakeApp: FC<Props> = ({
    eventName,
    initialState,
    children,
    ...options
  }) => {
    const state = useSSE(eventName, initialState, options);

    if (!children || typeof children !== 'function') {
      return null;
    }

    return createElement('div', {}, children(state));
  };

  it('expect to throw an error outside of `SSEContext`', () => {
    const eventName = 'push';
    const initialState = {
      value: 'Apple',
    };

    expect(() =>
      TestRenderer.create(
        createElement(FakeApp, {
          eventName,
          initialState,
        })
      )
    ).toThrowErrorMatchingInlineSnapshot(
      `"Could not find an SSE context; You have to wrap useSSE() in a <SSEProvider>."`
    );
  });

  it('expect to `useSSE` with the default options', () => {
    const { source } = createSourceMock();
    const context = createFakeContext(source);
    const children = jest.fn();
    const eventName = 'push';
    const initialState = {
      value: 'Apple',
    };

    TestRenderer.create(
      createElement(
        FakeApp,
        {
          eventName,
          initialState,
          context,
        },
        children
      )
    );

    expect(children).toHaveBeenCalledWith({
      value: 'Apple',
    });
  });

  describe('subscription', () => {
    it('expect to register a listener on mount', () => {
      const { source } = createSourceMock();
      const context = createFakeContext(source);
      const eventName = 'push';
      const initialState = {
        value: 'Apple',
      };

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            initialState,
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
      const { source } = createSourceMock();
      const context = createFakeContext(source);
      const eventName = 'push';
      const initialState = {
        value: 'Apple',
      };

      const renderer = TestRenderer.create(createElement('div'));
      const mockCreateElement = jest.fn(() =>
        createElement(FakeApp, {
          eventName,
          initialState,
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
      const { source } = createSourceMock();
      const context = createFakeContext(source);
      const renderer = TestRenderer.create(createElement('div'));
      const eventName = 'push';
      const initialState = {
        value: 'Apple',
      };

      act(() => {
        renderer.update(
          createElement(FakeApp, {
            eventName,
            initialState,
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
      const { source } = createSourceMock();
      const context = createFakeContext(source);
      const children = jest.fn();
      const eventName = 'push';
      const initialState = {
        value: 'Apple',
      };

      act(() => {
        TestRenderer.create(
          createElement(
            FakeApp,
            {
              eventName,
              initialState,
              context,
            },
            children
          )
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 'iPhone',
          }),
        });
      });

      expect(children).toHaveBeenLastCalledWith({
        value: 'iPhone',
      });
    });

    it('expect to parse the value with the given parser', () => {
      const { source } = createSourceMock();
      const context = createFakeContext(source);
      const children = jest.fn();
      const eventName = 'push';
      const initialState = {
        value: 'Apple',
      };

      const parser = (input: any) => {
        const data = JSON.parse(input);
        data.value += ' XS';
        return data;
      };

      act(() => {
        TestRenderer.create(
          createElement(
            FakeApp,
            {
              eventName,
              initialState,
              parser,
              context,
            },
            children
          )
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 'iPhone',
          }),
        });
      });

      expect(children).toHaveBeenLastCalledWith({
        value: 'iPhone XS',
      });
    });

    it('expect to call the stateReducer with state, data and event', () => {
      const { source } = createSourceMock();
      const context = createFakeContext(source);
      const eventName = 'push';
      const stateReducer = jest.fn((_, action) => action);
      const initialState = {
        value: 'Apple',
      };

      act(() => {
        TestRenderer.create(
          createElement(FakeApp, {
            eventName,
            initialState,
            stateReducer,
            context,
          })
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 'Apple',
          }),
        });
      });

      expect(stateReducer).toHaveBeenLastCalledWith(
        {
          value: 'Apple',
        },
        {
          data: {
            value: 'Apple',
          },
          event: {
            data: JSON.stringify({
              value: 'Apple',
            }),
          },
        }
      );

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 'Apple iPhone XS',
          }),
        });
      });

      expect(stateReducer).toHaveBeenLastCalledWith(
        {
          data: {
            value: 'Apple',
          },
          event: {
            data: JSON.stringify({
              value: 'Apple',
            }),
          },
        },
        {
          data: {
            value: 'Apple iPhone XS',
          },
          event: {
            data: JSON.stringify({
              value: 'Apple iPhone XS',
            }),
          },
        }
      );
    });

    it('expect to return the value from the default stateReducer', () => {
      const { source } = createSourceMock();
      const context = createFakeContext(source);
      const children = jest.fn();
      const eventName = 'push';
      const initialState = {
        value: 'Apple',
      };

      act(() => {
        TestRenderer.create(
          createElement(
            FakeApp,
            {
              eventName,
              initialState,
              context,
            },
            children
          )
        );
      });

      act(() => {
        // Simulate SSE server
        source.simulate(eventName, {
          data: JSON.stringify({
            value: 'Apple iPhone',
          }),
        });
      });

      expect(children).toHaveBeenLastCalledWith({
        value: 'Apple iPhone',
      });
    });

    it('expect to return the value from the given stateReducer', () => {
      const children = jest.fn();
      const eventName = 'push';
      const initialState = {
        value: 'first',
        previous: null,
      };

      const stateReducer = (state: any, action: any) => ({
        value: action.data.value,
        previous: state.value,
      });

      const { source } = createSourceMock();
      const context = createFakeContext(source);

      act(() => {
        TestRenderer.create(
          createElement(
            FakeApp,
            {
              eventName,
              initialState,
              stateReducer,
              context,
            },
            children
          )
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
