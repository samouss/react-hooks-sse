import { createElement } from 'react';
import TestRenderer from 'react-test-renderer';
import { SSEProvider, SSEConsumer } from '../SSEContext';
import { createSourceManager } from '../createSourceManager';

jest.mock('../createSourceManager', () => ({
  createSourceManager: jest.fn(),
}));

describe('SSEContext', () => {
  const defaultOptions = {
    endpoint: 'http://localhost/sse',
  };

  beforeEach(() => {
    (createSourceManager as jest.Mock).mockReset();
  });

  it('expect to create a source manager with default options', () => {
    TestRenderer.create(
      createElement(SSEProvider, {
        ...defaultOptions,
      })
    );

    expect(createSourceManager).toHaveBeenCalledWith({
      endpoint: 'http://localhost/sse',
      options: {
        withCredentials: false,
      },
    });
  });

  it('expect to create a source manager with provided options', () => {
    TestRenderer.create(
      createElement(SSEProvider, {
        ...defaultOptions,
        options: {
          withCredentials: true,
        },
      })
    );

    expect(createSourceManager).toHaveBeenCalledWith({
      endpoint: 'http://localhost/sse',
      options: {
        withCredentials: true,
      },
    });
  });

  it('expect to create a source manager only once across render', () => {
    const createProviderElement = () =>
      createElement(SSEProvider, {
        ...defaultOptions,
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
          ...defaultOptions,
        },
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
