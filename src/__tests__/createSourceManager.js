import { createSourceManager } from '../createSourceManager';

const createEventSourceMock = () =>
  jest.fn((endpoint, options) => ({
    ...options,
    endpoint,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    close: jest.fn(),
  }));

describe('createSourceManager', () => {
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
      const manager = createSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener();

      expect(window.EventSource).toHaveBeenCalledTimes(1);
      expect(manager.getState().source.endpoint).toBe('http://localhost/sse');
    });

    it('expect to create a source that listen on `http://localhost/sse` with options', () => {
      const manager = createSourceManager({
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
      const manager = createSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener(event, listener);

      expect(manager.getState().source.addEventListener).toHaveBeenCalledWith(
        event,
        listener
      );
    });

    it('expect to create a source only once a listener is added', () => {
      const manager = createSourceManager({
        ...defaultOptions,
      });

      expect(window.EventSource).toHaveBeenCalledTimes(0);

      manager.addEventListener();

      expect(window.EventSource).toHaveBeenCalledTimes(1);
    });

    it('expect to create a source only once with multiple listeners', () => {
      const manager = createSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener();
      manager.addEventListener();
      manager.addEventListener();

      expect(window.EventSource).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeEventListener', () => {
    it('expect to remove a listener on a source with the provided arguments', () => {
      const event = 'event';
      const listener = () => {};
      const manager = createSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener(event, listener);

      const { source } = manager.getState();

      manager.removeEventListener(event, listener);

      expect(source.removeEventListener).toHaveBeenCalledWith(event, listener);
    });

    it('expect to close the source if the listener is the last one of all events', () => {
      const event = 'event';
      const listener = () => {};

      const manager = createSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener(event, listener);

      const { source } = manager.getState();

      manager.removeEventListener(event, listener);

      expect(source.close).toHaveBeenCalled();
      expect(manager.getState().source).toBe(null);
    });

    it('expect to not close the source if the listener is the last of one of the events', () => {
      const event0 = 'event0';
      const listener0 = () => {};

      const event1 = 'event';
      const listener1 = () => {};

      const manager = createSourceManager({
        ...defaultOptions,
      });

      manager.addEventListener(event0, listener0);
      manager.addEventListener(event1, listener1);

      const { source } = manager.getState();

      manager.removeEventListener(event0, listener0);

      expect(source.close).not.toHaveBeenCalled();
      expect(manager.getState().source).toBe(source);
    });
  });
});
