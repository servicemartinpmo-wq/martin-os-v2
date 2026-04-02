# WeWeb Integration

Use `headless-bridge/martin-sdk.js` as the canonical zero-dependency SDK for WeWeb Global Scripts.

## Quick start

1. Paste `headless-bridge/martin-sdk.js` into a WeWeb global script.
2. Initialize:

```js
const sdk = createMartinSdk({ baseUrl: 'https://your-domain.com' })
```

3. Call data endpoints:

```js
const goals = await sdk.getGoals()
const tech = await sdk.getTechOps()
const miiddle = await sdk.getMiiddle()
```

4. Stream AI:

```js
await sdk.streamAI(
  { appView: 'PMO', snapshot: 'Current portfolio context' },
  {
    onChunk: (chunk) => console.log(chunk),
    onComplete: ({ text }) => console.log('done', text),
    onError: (err) => console.error(err),
  },
)
```

All APIs are JSON-first and can be consumed from React, WeWeb, or any other frontend.
