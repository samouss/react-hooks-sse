import * as React from 'react';
import { SourceManager, createSourceManager } from './createSourceManager';
import { Source } from './source';

export const SSEContext = React.createContext<SourceManager | null>(null);

export const SSEConsumer = SSEContext.Consumer;

type WithSource = { source: () => Source };
type WithEndpoint = { endpoint: string };
type Props = React.PropsWithChildren<WithSource | WithEndpoint>;

const isPropsWithSource = (_: WithSource | WithEndpoint): _ is WithSource =>
  'source' in _;

const createDefaultSource = (endpoint: string) => (): Source =>
  new window.EventSource(endpoint);

export const SSEProvider: React.FC<Props> = ({ children, ...props }) => {
  const [source] = React.useState(() =>
    createSourceManager(
      !isPropsWithSource(props)
        ? createDefaultSource(props.endpoint)
        : props.source
    )
  );

  return React.createElement(
    SSEContext.Provider,
    {
      value: source,
    },
    children
  );
};
