# Step 7 — Load from Backend · `fetch` + MSW

In the previous steps you seeded IndexedDB directly in the browser. Real apps
fetch that data from a server. This step introduces `fetch`, a lightweight
**loader component** pattern, and **MSW** (Mock Service Worker) — which lets
you write components that talk to a real HTTP API from day one, with no server
needed yet.

The key insight: **the components never know whether the response comes from
MSW, a staging server, or production.** Remove the MSW setup and the same
code works unchanged.

---

## The data flow

```
[CodeFreeze 2025] button clicked
        │
        ▼
cfb-schedule-loader ──── fetch /api/schedule/:id ──▶ (MSW) ──▶ IndexedDB
cfb-session-loader  ──── fetch /api/sessions/:id ──▶ (MSW) ──▶ IndexedDB
        │
        │  both dispatch bubbling CustomEvents
        │  scheduleLoaded / sessionsLoaded
        ▼
cfb-board-orchestrator
        │
        │  waits for BOTH, then sets data-latest-updated-at
        ▼
cfb-schedule  ◀── reads IndexedDB ── re-renders
```

---

## What you're building

Four components, each with a single responsibility:

| Component                     | Job                                                        |
|-------------------------------|------------------------------------------------------------|
| `<cfb-schedule-loader>`       | fetch schedule metadata → save to IDB → fire event         |
| `<cfb-session-loader>`        | fetch sessions list → save to IDB → fire event             |
| `<cfb-board-orchestrator>` | wait for both loaders → signal `.listens-schedule-updates` |
| `<cfb-schedule>`              | observe an attribute change → read IDB → render            |

```html

<cfb-board-orchestrator>
    <cfb-schedule-loader data-event-id="codefreeze-2025"></cfb-schedule-loader>
    <cfb-session-loader data-event-id="codefreeze-2025"></cfb-session-loader>
    <cfb-schedule data-event-id="codefreeze-2025" class="listens-schedule-updates"></cfb-schedule>
</cfb-board-orchestrator>
```

---

## Setup — MSW

### Install

```bash
npm init -y
npm install --save-dev msw
```

### Copy the service-worker file into your step folder

```bash
npx msw init . --save
```

This places `mockServiceWorker.js` in the current directory so the browser
can register it as a Service Worker.

### File structure

```
step-7/
  mocks/
    handlers.js     ← define fake API responses here
    browser.js      ← creates and starts the MSW worker
  index.js          ← starts MSW, then registers custom elements
  cfb-schedule-loader.js
  cfb-session-loader.js
  cfb-board-orchestrator.js
  cfb-schedule.js
  schedule-store.js
  index.html
```

---

## What to build

### `cfb-schedule-loader` and `cfb-session-loader`

Both loaders follow the same pattern — write one, then copy-adapt the other.

- [ ] Observe `data-event-id`
- [ ] On `connectedCallback` (and on attribute change), call `fetch('/api/…/:id')`
- [ ] Save the JSON response to IndexedDB via `schedule-store.js`
- [ ] Dispatch a bubbling `CustomEvent` (`scheduleLoaded` / `sessionsLoaded`)
  with `{ eventId, updatedAt: Date.now() }` in `detail`
- [ ] Show loading / done / error status as the element's own `textContent`

```js
async
#load(eventId)
{
  this.#setStatus('loading', `fetching sessions for "${eventId}"…`)
  try {
    const res = await fetch(`/api/sessions/${eventId}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const sessions = await res.json()
    await saveSessions(sessions)
    this.#setStatus('done', `${sessions.length} sessions stored`)
    this.dispatchEvent(new CustomEvent('sessionsLoaded', {
      bubbles: true,
      detail: { eventId, updatedAt: Date.now() },
    }))
  } catch (err) {
    this.#setStatus('error', err.message)
  }
}
```

### `cfb-board-orchestrator`

- [ ] In `connectedCallback`, listen for both `scheduleLoaded` and
  `sessionsLoaded` on `this` (they bubble up from the children)
- [ ] Track which loader types have reported back using a `Set`
- [ ] When **both** have fired for the same `eventId`, set
  `data-latest-updated-at` on the child `<cfb-schedule>`
- [ ] Reset the tracker when `eventId` changes so a stale pair from the
  previous event cannot trigger a render for the new one
- [ ] Remove listeners in `disconnectedCallback`

```js
// Inside cfb-board-orchestrator
#loaded = new Set()
#currentEventId = null

#onLoaderDone = (e) => {
  const { eventId, updatedAt } = e.detail
  if (eventId !== this.#currentEventId) {
    this.#loaded.clear()
    this.#currentEventId = eventId
  }
  this.#loaded.add(e.type)  // 'scheduleLoaded' | 'sessionsLoaded'
  if (this.#loaded.has('scheduleLoaded') && this.#loaded.has('sessionsLoaded')) {
    this.querySelector('cfb-schedule')
      ?.setAttribute('data-latest-updated-at', String(updatedAt))
    this.#loaded.clear()
  }
}
```

### `cfb-schedule`

- [ ] Observe `data-latest-updated-at`
- [ ] When the attribute changes, read sessions for the current `data-event-id`
  from IndexedDB and re-render
- [ ] Render a "Waiting for data…" placeholder until the first update arrives

### MSW handlers (`mocks/handlers.js`)

- [ ] `GET /api/schedule/:eventId` — return schedule metadata as JSON
- [ ] `GET /api/sessions/:eventId` — return a session array as JSON
- [ ] Return `404` for unknown event IDs

```js
// mocks/handlers.js  (MSW v2)
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/schedule/:eventId', ({ params }) => {
    const data = SCHEDULES[params.eventId]
    if (!data) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(data)
  }),
  http.get('/api/sessions/:eventId', ({ params }) => {
    const data = SESSIONS[params.eventId]
    if (!data) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(data)
  }),
]
```

### Starting MSW before components connect (`index.js`)

Register the worker **before** any custom element touches the DOM so the
first `fetch` is already intercepted:

```js
import { worker } from './mocks/browser.js'

await worker.start({ onUnhandledRequest: 'warn' })

// register custom elements after this line
```

---

## Constraints

- HTML, JavaScript, and CSS only — no frameworks in the components.
- MSW is the only dev dependency.
- Target: 45 minutes.

---

## Extras

- [ ] Add a `<cfb-loader-status>` atom driven only by the bubbling events —
  no direct reference to the loaders
- [ ] Add a `passthrough` handler for one event ID so it hits a real server,
  while the rest stay mocked
- [ ] Return `{ status: 500 }` from one handler, let the loader dispatch
  `loaderError`, and surface it in the UI
- [ ] Persist `updatedAt` in IndexedDB and skip the fetch when cached data is
  less than 60 seconds old

---

## Learning goals

- `fetch()` and async error handling with `res.ok`
- Loader component pattern: side-effect (fetch + store) vs display (read + render)
- `CustomEvent` bubbling as a **completion signal** between components
- Orchestrator waiting for multiple independent async results before acting
- `attributeChangedCallback` as a **pull trigger**: component reads fresh data
  rather than receiving it directly
- How MSW decouples frontend development from backend availability

---

## Issues / notes

If you get stuck, note down the problem here so we can discuss it together.
