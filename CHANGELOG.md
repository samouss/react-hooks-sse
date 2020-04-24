# [2.0.0](https://github.com/samouss/react-hooks-sse/compare/v1.0.0...v2.0.0) (2020-04-24)

### Breaking changes

#### `initialState` is required

It follows the default implementation of [`React.Reducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) which requires the initial state. To better reflect this change the signature of the hook also changed. The `eventName` **and** `initialState` are now positional parameters. It also helps to infer the state with TypeScript.

```diff
const state = useSSE(
  'comments',
+  {
+    count: null,
+  }
-  {
-    initialState: {
-      count: null,
-    },
-  }
);
```

#### `stateReducer` default implementation

The signature of the default `stateReducer` was incorrect. The new implementation is now compliant with its signature. By default we assume that the data that comes from the server is the same as the state. You can override this behavior with the type parameter `T`.

```diff
const state = useSSE<S, T>(
  'comments',
  {
    count: null,
  },
  {
    stateReducer(state: S, action: Action<T>) {
-      return changes;
+      return changes.data;
    },
  }
);
```

### Features

#### External source

You can now provide a custom source to the `SSEProvider`.

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

You can find more information in the [documentation](README.md#SSEProvider).
