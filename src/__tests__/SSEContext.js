import { createElement } from 'react';
import TestRenderer from 'react-test-renderer';
import { SSEProvider, SSEConsumer } from '../SSEContext';
import { createEventSourceManager } from '../createEventSourceManager';

jest.mock('../createEventSourceManager', () => ({
  createEventSourceManager: jest.fn(),
}));

describe('SSEContext', () => {
  const defaultOptions = {
    endpoint: 'http://localhost/sse',
  };

  beforeEach(() => {
    createEventSourceManager.mockReset();
  });

  it('expect to create a source manager with default options', () => {
    TestRenderer.create(
      createElement(SSEProvider, {
        ...defaultOptions,
      })
    );

    expect(createEventSourceManager).toHaveBeenCalledWith({
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

    expect(createEventSourceManager).toHaveBeenCalledWith({
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

    expect(createEventSourceManager).toHaveBeenCalledTimes(1);

    renderer.update(createProviderElement());
    renderer.update(createProviderElement());
    renderer.update(createProviderElement());

    expect(createEventSourceManager).toHaveBeenCalledTimes(1);
  });

  it('expect to expose a source manager through the context', () => {
    const manager = {};

    createEventSourceManager.mockImplementationOnce(() => manager);

    TestRenderer.create(
      createElement(
        SSEProvider,
        {
          ...defaultOptions,
        },
        createElement(SSEConsumer, {}, exposed => {
          expect(exposed).toBe(manager);
        })
      )
    );
  });
});
