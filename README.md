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

#### `SSEProvider`

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
interface Event {
  data: any;
}

interface Listener {
  (event: Event): void;
}

interface Source {
  addEventListener(name: string, listener: Listener): void;
  removeEventListener(name: string, listener: Listener): void;
  close(): void;
}
```

The source is lazy, it is created only when a hook is added. That's why we provide a function to create a source not a source directly.

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

----

#### `useSSE<S, T>(eventName: string, initialState: S, options?: Options<S, T>)`

The component that uses the hook must be scoped under a [`SSEProvider`](#SSEProvider) to have access to the source. Once the hook is created none of the options can be updated (at the moment). You have to unmout/remount the component to update the options.

#### Usage

```jsx
const state = useSSE('comments', {
  count: null
});
```

#### `eventName: string`

The name of the event that you want to listen.

```jsx
const state = useSSE('comments', {
  count: null
});
```

#### `initialState: S`

The initial state to use on the first render.

```jsx
const state = useSSE('comments', {
  count: null
});
```

#### `options?: Options<S, T>`

The options to control how the data is consumed from the source.

```ts
type Action<T> = { event: Event; data: T };
type StateReducer<S, T> = (state: S, changes: Action<T>) => S;
type Parser<T> = (data: any) => T;

export type Options<S, T = S> = {
  stateReducer?: StateReducer<S, T>;
  parser?: Parser<T>;
};
```

#### `options.stateReducer?: <S, T>(state: S, changes: Action<T>) => S`

The reducer to control how the state should be updated.

```ts
type Action<T> = {
  // event is provided by the source
  event: Event;
  // data is provided by the parser
  data: T;
};

const state = useSSE<S, T>(
  'comments',
  {
    count: null,
  },
  {
    stateReducer(state: S, action: Action<T>) {
      return changes.data;
    },
  }
);
```

#### `options.parser?: <T>(data: any) => T`

The parser to control how the event from the server is provided to the reducer.

```jsx
const state = useSSE<S, T>(
  'comments',
  {
    count: null,
  },
  {
    parser(input: any): T {
      return JSON.parse(input);
    },
  }
);
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
