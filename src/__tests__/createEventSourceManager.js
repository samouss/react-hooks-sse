import { createEventSourceManager } from '../createEventSourceManager';

const createEventSourceMock = () =>
  jest.fn((endpoint, options) => ({
    ...options,
    endpoint,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    close: jest.fn(),
  }));

describe('createEventSourceManager', () => {
  beforeEach(() => {
    window.EventSource = createEventSourceMock();
  });

  afterEach(() => {
    delete window.EventSource;
  });

  const defaultOptions = {
    endpoint: 'http://localhost/sse',
  };

  describe('addEventListener', () => {
    it('expect to create a source that listen on `http://localhost/sse`', () => {
      const manager = createEventSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener();

      expect(window.EventSource).toHaveBeenCalledTimes(1);
      expect(manager.getState().source.endpoint).toBe('http://localhost/sse');
    });

    it('expect to create a source that listen on `http://localhost/sse` with options', () => {
      const manager = createEventSourceManager({
        ...defaultOptions,
        options: {
          withCredentials: true,
        },
      });

      manager.addEventListener();

      expect(window.EventSource).toHaveBeenCalledTimes(1);
      expect(manager.getState().source.endpoint).toBe('http://localhost/sse');
      expect(manager.getState().source.withCredentials).toBe(true);
    });

    it('expect to create a listener on a source with the provided argument', () => {
      const event = 'event';
      const listener = () => {};
      const manager = createEventSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener(event, listener);

      expect(manager.getState().source.addEventListener).toHaveBeenCalledWith(
        event,
        listener
      );
    });

    it('expect to create a source only once a listener is added', () => {
      const manager = createEventSourceManager({
        ...defaultOptions,
      });

      expect(window.EventSource).toHaveBeenCalledTimes(0);

      manager.addEventListener();

      expect(window.EventSource).toHaveBeenCalledTimes(1);
    });

    it('expect to create a source only once with multiple listeners', () => {
      const manager = createEventSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener();
      manager.addEventListener();
      manager.addEventListener();

      expect(window.EventSource).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeEventListener', () => {
    it('expect to ', () => {});
  });
});
