import { createElement } from 'react';
import TestRenderer from 'react-test-renderer';
import { createSourceMock } from '../__mocks__/source.mock';
import { createSourceManager } from '../createSourceManager';
import { SSEProvider, SSEConsumer } from '../SSEContext';

// TODO
jest.mock('../createSourceManager', () => ({
  createSourceManager: jest.fn(),
}));

describe('SSEContext', () => {
  beforeEach(() => {
    (createSourceManager as jest.Mock).mockReset();
  });

  it('expect to create a source manager with `endpoint`', () => {
    TestRenderer.create(
      createElement(SSEProvider, {
        endpoint: 'http://localhost/sse',
      })
    );

    expect(createSourceManager).toHaveBeenCalledWith(expect.any(Function));
  });

  it('expect to create a source manager with `source`', () => {
    const { fn } = createSourceMock();

    TestRenderer.create(
      createElement(SSEProvider, {
        source: fn,
      })
    );

    expect(createSourceManager).toHaveBeenCalledWith(fn);
  });

  it('expect to create a source manager only once across render', () => {
    const createProviderElement = () =>
      createElement(SSEProvider, {
        endpoint: 'http://localhost/sse',
      });

    const renderer = TestRenderer.create(createProviderElement());

    expect(createSourceManager).toHaveBeenCalledTimes(1);

    renderer.update(createProviderElement());
    renderer.update(createProviderElement());
    renderer.update(createProviderElement());

    expect(createSourceManager).toHaveBeenCalledTimes(1);
  });

  it('expect to expose a source manager through the context', () => {
    const manager = {};

    (createSourceManager as jest.Mock).mockImplementationOnce(() => manager);

    TestRenderer.create(
      createElement(
        SSEProvider,
        {
          endpoint: 'http://localhost/sse',
        },
        // eslint-disable-next-line react/no-children-prop
        createElement(SSEConsumer, {
          children(context) {
            expect(context).toBe(manager);
            return null;
          },
        })
      )
    );
  });
});
