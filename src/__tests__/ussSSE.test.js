import { createElement, createContext } from 'react';
import TestRenderer from 'react-test-renderer';
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

        state.set(name, listeners.filter(x => x !== listener));
      }),
      simulate: (eventName, value) =>
        state.get(eventName).forEach(listener => listener(value)),
    };
  };

  const createFakeContext = source => createContext(source);

  const FakeApp = ({ eventName = 'push', ...options }) => {
    const value = useSSE(eventName, options);

    return createElement('div', {}, `Hello World from SSE with "${value}"`);
  };

  it('expect to `useSSE` with the default options', () => {
    const source = createFakeSource();
    const context = createFakeContext(source);
    const renderer = TestRenderer.create(
      createElement(FakeApp, {
        context,
      })
    );

    expect(renderer.root.findByType('div').children).toEqual([
      'Hello World from SSE with "null"',
    ]);
  });

  it('expect to `useSSE` with the provided `initialState`', () => {
    const source = createFakeSource();
    const context = createFakeContext(source);
    const renderer = TestRenderer.create(
      createElement(FakeApp, {
        initialState: 'earth',
        context,
      })
    );

    expect(renderer.root.findByType('div').children).toEqual([
      'Hello World from SSE with "earth"',
    ]);
  });

  describe('subscription', () => {
    it('expect to register a listener on mount', () => {
      const source = createFakeSource();
      const context = createFakeContext(source);

      TestRenderer.create(
        createElement(FakeApp, {
          context,
        })
      );

      expect(source.addEventListener).toHaveBeenCalledTimes(1);
      expect(source.addEventListener).toHaveBeenCalledWith(
        'push',
        expect.any(Function)
      );
    });

    it('expect to not register a listener on update', () => {
      const source = createFakeSource();
      const context = createFakeContext(source);
      const mockCreateElement = jest.fn(() =>
        createElement(FakeApp, {
          context,
        })
      );

      const createFakeApp = () => mockCreateElement();

      const renderer = TestRenderer.create(createFakeApp());

      expect(mockCreateElement).toHaveBeenCalledTimes(1);
      expect(source.addEventListener).toHaveBeenCalledTimes(1);

      renderer.update(createFakeApp());
      renderer.update(createFakeApp());
      renderer.update(createFakeApp());

      expect(mockCreateElement).toHaveBeenCalledTimes(4);
      expect(source.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('expect to remove the listener on unmount', () => {
      const source = createFakeSource();
      const context = createFakeContext(source);
      const renderer = TestRenderer.create(
        createElement(FakeApp, {
          context,
        })
      );

      renderer.unmount();

      expect(source.removeEventListener).toHaveBeenCalledTimes(1);
      expect(source.removeEventListener).toHaveBeenCalledWith(
        'push',
        expect.any(Function)
      );
    });
  });
});
