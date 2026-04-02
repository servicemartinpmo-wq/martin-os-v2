# WeWeb Integration

Use `headless-bridge/martin-sdk.js` as the canonical zero-dependency SDK for WeWeb Global Scripts.

## Quick start

1. Paste `headless-bridge/martin-sdk.js` into a WeWeb global script.
2. Initialize:

```js
const sdk = MartinSDK.createClient({ baseUrl: 'https://your-domain.com' })
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
    onComplete: () => console.log('done'),
    onError: (err) => console.error(err),
  },
)
```

5. Write/read operational context:

```js
await sdk.pushMemoryEvent({
  type: 'next_action',
  summary: 'Run weekly portfolio checkpoint',
  idempotencyKey: 'mem-weekly-checkpoint-2026-04-02',
})

await sdk.pushLearningEvent({
  decision: 'Shift roadmap milestone',
  outcome: 'Reduced delivery risk',
  owner: 'PMO',
  idempotencyKey: 'learn-roadmap-shift-2026-04-02',
})

const memory = await sdk.getMemory(25)
const learning = await sdk.getLearning(25)
const profile = await sdk.getPreferences('default')
```

All APIs are JSON-first and can be consumed from React, WeWeb, or any other frontend.
