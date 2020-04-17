import { FC, createElement, createContext, useState } from 'react';
import {
  SourceManager,
  SourceManagerOptions,
  createSourceManager,
} from './createSourceManager';

export const SSEContext = createContext<SourceManager | null>(null);

export const SSEConsumer = SSEContext.Consumer;

export const SSEProvider: FC<SourceManagerOptions> = ({
  endpoint,
  options,
  children,
}) => {
  const [source] = useState(() =>
    createSourceManager({
      endpoint,
      options,
    })
  );

  return createElement(
    SSEContext.Provider,
    {
      value: source,
    },
    children
  );
};

SSEProvider.defaultProps = {
  options: {
    withCredentials: false,
  },
};
