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
});
