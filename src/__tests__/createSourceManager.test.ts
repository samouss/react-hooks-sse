import { createSourceMock } from '../__mocks__/source.mock';
import { createSourceManager } from '../createSourceManager';

describe('createSourceManager', () => {
  describe('addEventListener', () => {
    it('expect to create a source', () => {
      const { fn } = createSourceMock();
      const manager = createSourceManager(fn);
      const event = 'event';
      const listener = () => {};

      manager.addEventListener(event, listener);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('expect to create a listener on a source with the provided argument', () => {
      // TODO: dispatch with a fake source
      const { fn, source } = createSourceMock();
      const manager = createSourceManager(fn);
      const event = 'event';
      const listener = () => {};

      manager.addEventListener(event, listener);

      expect(source.addEventListener).toHaveBeenCalledWith(event, listener);
    });

    it('expect to create a source only once a listener is added', () => {
      const { fn } = createSourceMock();
      const manager = createSourceManager(fn);
      const event = 'event';
      const listener = () => {};

      expect(fn).toHaveBeenCalledTimes(0);

      manager.addEventListener(event, listener);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('expect to create a source only once with multiple listeners', () => {
      const { fn } = createSourceMock();
      const manager = createSourceManager(fn);
      const event = 'event';
      const listener = () => {};

      manager.addEventListener(event, listener);
      manager.addEventListener(event, listener);
      manager.addEventListener(event, listener);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeEventListener', () => {
    it('expect to remove a listener on a source with the provided arguments', () => {
      const { fn, source } = createSourceMock();
      const manager = createSourceManager(fn);
      const event = 'event';
      const listener = () => {};

      manager.addEventListener(event, listener);
      manager.removeEventListener(event, listener);

      expect(source.removeEventListener).toHaveBeenCalledWith(event, listener);
    });

    it('expect to close the source if the listener is the last one of all events', () => {
      const { fn, source } = createSourceMock();
      const manager = createSourceManager(fn);
      const event = 'event';
      const listener = () => {};

      manager.addEventListener(event, listener);
      manager.removeEventListener(event, listener);

      expect(source.close).toHaveBeenCalled();
    });

    it('expect to not close the source if more listeners remain', () => {
      const { fn, source } = createSourceMock();
      const manager = createSourceManager(fn);

      const event0 = 'event0';
      const listener0 = () => {};

      const event1 = 'event';
      const listener1 = () => {};

      manager.addEventListener(event0, listener0);
      manager.addEventListener(event1, listener1);
      manager.removeEventListener(event0, listener0);

      expect(source.close).not.toHaveBeenCalled();
    });
  });
});
