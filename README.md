# React Hooks SSE

[![npm version](https://badge.fury.io/js/react-hooks-sse.svg)](https://badge.fury.io/js/react-hooks-sse) [![Build Status](https://travis-ci.org/samouss/react-hooks-sse.svg?branch=master)](https://travis-ci.org/samouss/react-hooks-sse)

## Installation

```
yarn add react-hooks-sse
```

## Usage

```jsx
import React from 'react';
import { useSSE, SSEProvider } from 'react-hooks-sse';

const Comments = () => {
  const state = useSSE('comments', {
    count: null
  });

  return state.count ? state.count : '...';
};

const App = () => (
  <SSEProvider endpoint="https://sse.example.com">
    <h1>Subscribe & update to SSE event</h1>
    <Comments />
  </SSEProvider>
);
```

> Checkout [the example](/example) on the project

## API

### `SSEProvider`

The provider manages subscriptions to the SSE server. You can subscribe multiple times to the same event or on different events. The source is lazy, it is created only when one of the hooks is called. The source is destroyed when no more hooks are registered. It is automatically re-created when a new hook is added.

#### Usage

```jsx
import React from 'react';
import { SSEProvider } from 'react-hooks-sse';

const App = () => (
  <SSEProvider endpoint="https://sse.example.com">
    {/* ... */}
  </SSEProvider>
);
```

#### `endpoint: string`

> The value is required when `source` is omitted.

The SSE endpoint to target. It uses the default source [`EventSource`][EventSource].

```jsx
import React from 'react';
import { SSEProvider } from 'react-hooks-sse';

const App = () => (
  <SSEProvider endpoint="https://sse.example.com">
    {/* ... */}
  </SSEProvider>
);
```

#### `source: () => Source`

> The value is required when `endpoint` is omitted.

You can provide custom source to the provider. The main use cases are:

- provide additional options to [`EventSource`][EventSource] e.g. [`withCredentials: true`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource#Parameters)
- provide a custom source to control the network request e.g. set `Authorization` header

Here is the interface that a source has to implement:

```ts
export interface Event {
  data: any;
}

export interface Listener {
  (event: Event): void;
}

export interface Source {
  addEventListener(name: string, listener: Listener): void;
  removeEventListener(name: string, listener: Listener): void;
  close(): void;
}
```

The source is lazy. It is created only when a hook is added. That's why we provide a function to create a source not a source directly.

```jsx
import React from 'react';
import { SSEProvider } from 'react-hooks-sse';
import { createCustomSource } from 'custom-source';

const App = () => (
  <SSEProvider source={() => createCustomSource()}>
    {/* ... */}
  </SSEProvider>
);
```

### `useSSE`

The component that uses the hook must be scoped under a `SSEProvider` to have access to the source. Once the hook is created none of the options can be updated (at the moment). You have to unmout / remount the component to update the options.


| Name                 | Type                          | Required | Default                        | Description                                                                     |
| -------------------- | ----------------------------- | -------- | ------------------------------ | ------------------------------------------------------------------------------  |
| eventName            | `string`                      | `true`   | -                              | The name of the event that you want to listen.                                  |
| options              | `object`                      | `false`  | -                              | -                                                                               |
| options.initialState | `T`                           | `false`  | `null`                         | The initial state to use on the first render.                                   |
| options.stateReducer | `(state: T, changes: U) => T` | `false`  | `(state, changes) => changes`  | The state reducer to control how the state should be updated.                   |
| options.parser       | `(input: string) => U`        | `false`  | `(input) => JSON.parse(input)` | The parser to control how the event from the server is provided to the reducer. |

#### Usage

```jsx
import React from 'react';
import { useSSE } from 'react-hooks-sse';

const Comments = () => {
  const state = useSSE('comments', {
    initialState: {
      data: {
        value: null,
      },
    },
    stateReducer(state, changes) {
      // changes.event - event provided by the source
      // changes.data - data provided by the parser

      return changes;
    },
    parser(input) {
      return JSON.parse(input);
    },
  });

  return <p>{state.data.value !== null && <span>{state.data.value}</span>}</p>;
};
```

## Run example

```
yarn start:server
```

```
yarn start:example
```

## Run the build

```
yarn build
```

## Run the test

```
yarn test
```

[EventSource]: https://developer.mozilla.org/en-US/docs/Web/API/EventSource
