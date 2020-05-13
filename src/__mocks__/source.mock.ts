import { Source } from '../source';

export type SourceMock = Source & {
  simulate(event: string, value: any): void;
};

export const createSourceMock = () => {
  const state = new Map<string, Array<(...args: any[]) => void>>();
  const source: SourceMock = {
    close: jest.fn(),
    addEventListener: jest.fn((name, listener) => {
      const listeners = state.get(name) || [];

      state.set(name, listeners.concat(listener));
    }),
    removeEventListener: jest.fn((name, listener) => {
      const listeners = state.get(name) || [];

      state.set(
        name,
        listeners.filter(x => x !== listener)
      );
    }),
    simulate: (eventName: string, value: any) => {
      const listeners = state.get(eventName) || [];
      listeners.forEach(listener => listener(value));
    },
  };

  return {
    fn: jest.fn<Source, unknown[]>(() => source),
    source,
  };
};
