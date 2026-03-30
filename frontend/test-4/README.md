# Test Step T-4 — IndexedDB Store · Async Round-Trips

In T-3 you tested synchronous event flows. This step introduces a new challenge:
**the store is asynchronous**. `session-store.js` wraps IndexedDB in Promises,
which means components that read from it fire their events after a microtask (or
several). Your tests need to handle that.

There are also three components with distinct responsibilities to test:

| Component                  | Its one job                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| `<cfb-session-store>`      | Listen for session events, write to IDB, fire `sessionsLoaded`              |
| `<cfb-session-loader>`     | Read all sessions from IDB on connect, fire `sessionsLoaded`                |
| `<cfb-board-orchestrator>` | Listen for `sessionsLoaded`, push `data-sessions` down to schedule elements |

Notice that `<cfb-board-orchestrator>` has no IDB involvement — it is stateless.
Only the loader and store components touch the database.

---

## What to build

- [ ] Decide: test against **real IndexedDB** or a **fake in-memory store**?
  (see Tips below — this is the most important design decision in this step)
- [ ] Write `test/cfb-board-orchestrator.test.js` — no IDB, pure event wiring
- [ ] Write `test/cfb-session-loader.test.js` — connect element, await `sessionsLoaded`
- [ ] Write `test/cfb-session-store.test.js` — dispatch session events, await `sessionsLoaded`
- [ ] Write tests for the indexedDB store functionality.

## Constraints

- Do **not** assert on `innerHTML` or implementation details.
- Assert on observable output: event `detail.sessions` contents, `data-sessions`
  attribute values, `bubbles` flag.
- Max **30 minutes**.

---

## Tips

### Real IndexedDB or a fake store?

This is the key design question for this step. Both approaches are valid — the
right answer depends on what you want to test.

**Option A — Test against the real IndexedDB**

Tests run against the actual browser database. Slow but high-fidelity.
Each test must drop and recreate the database in `afterEach` to avoid bleed-over:

```js
function dropDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(DB_NAME)
    req.onsuccess = resolve
    req.onerror = (e) => reject(e.target.error)
  })
}

afterEach(async () => {
  cleanup();
  await dropDb()
})
```

If you choose this one, make sure you don't accidentally add the `dropDb` into the production code,
but that only lies in the test code.

**Option B — Swap the store for a fake via import map**

Write a `test/helpers/fake-session-store.js` that exports the same functions as
`session-store.js` (`saveSessions`, `getAllSessions`, `deleteSession`, …) but
stores data in a plain in-memory array. Then remap the import in
`web-test-runner.config.mjs`:

```js
const testImportMappings = {
  '../step-4/session-store.js': './test/helpers/fake-session-store.js',
}
```

With the swap in place, every component that `import`s `session-store.js` gets
the fake instead — no component code changes, no `if (test)` branches.

**Option C — Test the store implementation against real DB, but use 'sinon' in all other test cases**

Two-step approach. Test the actual store against real IndexedDB, and fake all the usages of the store.
This

**Option D — run store implementation test both against realDB and against fake implementation**

This makes sure that we can trust on the fake implementation. But would require some other means of magic
to be able to run the same test against both real store and the fake store.

**Trade-offs to consider:**

|                         | Real IDB                     | Fake store                        | Mock / contract with fake              |
|-------------------------|------------------------------|-----------------------------------|----------------------------------------|
| Confidence              | Tests the real browser API   | Tests the component wiring only   | As long as mock data is ok, good       |
| Speed                   | Slower — async DB operations | Instant — plain array             | One test slow, others fast             |
| Isolation               | `dropDb()` teardown required | `resetForTests()` in-memory clear | can be made test specific              | 
| What can break silently | Nothing — IDB bugs surface   | IDB bugs stay hidden              | if contract is not tested, many things |
| Best for                | Store API correctness        | Component behaviour               | You define                             |

A common approach: use the fake for most tests (fast, focused), and run a
separate contract test against the real IndexedDB to verify the store API itself.
That is the split used in this step's two npm scripts:

```bash
npm run test:store:fake   # fast suite — all components, fake store
npm run test:store:real   # slow suite — session-store.js vs real IDB only
```

### Inspecting IndexedDB with `test:manual`

When tests against the real database fail in unexpected ways, it helps to
open the browser DevTools and inspect the database state directly.

Run the test suite in manual mode:

```bash
npm run test:manual
```

This keeps the browser open and prints a URL. Open it, open **DevTools →
Application → IndexedDB**, and you can see exactly what is stored (or not
stored) after each test run. This is particularly useful when `dropDb()`
does not fire cleanly and sessions bleed from one test into the next.

### `waitForEvent` — awaiting a future event on an element

For components that fire events in response to a dispatched event (rather than
on connect), a simpler helper works:

```js
export function waitForEvent(target, eventType) {
  return new Promise(resolve => {
    target.addEventListener(eventType, (e) => resolve(e), { once: true })
  })
}
```

Usage:

```js
const sessionsLoaded = waitForEvent(el, 'sessionsLoaded')
el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 'new-1' })))
const { detail } = await sessionsLoaded
```

### What to assert

| Component                | What to test                                                                                                                                              |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cfb-board-orchestrator` | `sessionsLoaded` event → `data-sessions` attribute set on all `.cfb-updates-schedule` targets; second event replaces the first                            |
| `cfb-session-loader`     | Fires `sessionsLoaded` with an empty array when store is empty; fires with the correct sessions when store is pre-populated; event `bubbles`              |
| `cfb-session-store`      | `cfb-session-created` → `sessionsLoaded` includes the new session; two events accumulate; `cfb-session-removed` → session gone from next `sessionsLoaded` |
| `store`                  | Test all the behavior of the IndexedDB                                                                                                                    | 

---

## Extras

- [ ] **Write a contract test for `session-store.js`** against the real IndexedDB.
  Cover `saveSessions`, `getAllSessions`, `deleteSession`, `getSessionsByDay`. 
  Run it with a separate config that does not apply the import map swap so it hits real IDB.
- [ ] **Implement a `fake-session-store.js`** that mirrors the `session-store.js`
  API using a plain array — then flip between the two via the import map
  to experience the trade-off first-hand
- [ ] Test `disconnectedCallback` — dispatch an event after removing the element
  from the DOM and assert no `sessionsLoaded` is fired
- [ ] Test that `seedIfEmpty` in `session-store.js` is idempotent — calling it
  twice does not duplicate seed data

---

## Demos

If you complete the challenge, share a short screen recording or paste your
terminal output here.

## Issues

If you get stuck, note the problem here so we can discuss it together.

---

### End result

After completing this step you will have learned:

- Why async components need a different mounting helper than synchronous ones —
  `connectedCallback` can fire an event before your listener is attached
- How **import map swapping** replaces a real dependency with a test fake without
  touching any component code — a browser-native alternative to `jest.mock()`
- The trade-off between testing against **real IndexedDB** (high confidence, slower,
  needs teardown) and a **fake in-memory store** (fast, isolated, but cannot
  catch IDB-specific bugs)
- How to use `npm run test:manual` and the browser DevTools to inspect IndexedDB
  state when tests fail in unexpected ways
- The value of splitting tests into two suites: a fast fake-backed suite for
  component behaviour, and a slow real-IDB contract suite for the store API
