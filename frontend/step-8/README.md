# Step 8 - Live Updates · WebSocket + session store

Step 7 taught **pull**: loaders **`fetch`** data, write IndexedDB, and the orchestrator refreshes the schedule. 
Step 8 adds **push**: a **WebSocket** feed (in backend) writes session changes into the **same** IndexedDB path, 
and the **same** orchestrator signal refreshes the board - **no second render pipeline**. This way, you'll see how
the chosen component structure supports **live updates**.

A second idea: **one component owns IDB writes** for sessions (`<cfb-session-store-updates>`), while the 
**loader only fetches** and the **live component only listens**. That separation of getting data from backend and 
storing it in different component is the main architectural lesson from WebComponent point of view.

Form add/edit/remove still goes through **`<cfb-updates-sessions>`** → HTTP - **unchanged** from Step 7.

The backend (**[`step-8-be`](../step-8-be/README.md)**) is **already provided**. It supports now (in addition to what step-7 backend):
- WebSocket broadcast, 
- Adding a random session
- Deleting a session 

> **Before you start:** branch, HTTP server from **`frontend/`**, **`step-8-be`** running - see [getting-started.md](./getting-started.md).

### Async / solo

Use [your Step 8 learning log](./learning-log.md), a short note to your facilitator, or a sync when the README says “compare.” **Timeboxes** beat polish.

---

## Learning goal

By the end of this step, you can:

- Open a **`WebSocket`**, parse **`message`** payloads, and **close** the socket in **`disconnectedCallback`**.
- Explain why **`<cfb-live-session-updates>`** does **not** write IndexedDB directly
- Trace **`sessionsLoaded`** bubbling to **`<cfb-board-orchestrator>`** so **`cfb-schedule`** re-renders - the **same**
  path as Step 7’s initial load.
- Contrast **pull** (loader / form → HTTP → reload) with **push** (WebSocket → store → schedule) while having the same
  structure as in Step-7

---

## 1) Connections

Do these **in order**; capture answers in [your Step 8 learning log](./learning-log.md).

1. **Solo, ~2 min - Think → ink (push vs pull)**  
   [Push vs pull](./learning-log.md#step-8-connections-push-vs-pull) *(revisit in [Loop back](./learning-log.md#step-8-loop-back-push-vs-pull)).*

2. **Solo, ~4 min - Bridge from Step 7**  
   [Bridge from Step 7](./learning-log.md#step-8-bridge-step-7).

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-8-connections-surprise).

4. **Solo, ~2 min - Topic link**  
   [Topic link](./learning-log.md#step-8-topic-link): answer **A** or **B**.

---

## 2) Concepts

### Pull vs push in this app

| Path                         | Trigger                               | Network                     | Who writes sessions IDB                                       | Schedule refresh                            |
|------------------------------|---------------------------------------|-----------------------------|---------------------------------------------------------------|---------------------------------------------|
| **Initial load**             | `data-event-id` / page load           | `GET` sessions              | **`<cfb-session-store-updates>`** (via **`sessionsFetched`**) | **`sessionsLoaded`** + **`scheduleLoaded`** |
| **Form add / edit / remove** | User form or card menu                | `PUT` / `PATCH` / `DELETE`  | Loader refetch → store (via **`sessionsBackendUpdated`**)     | Same orchestrator path                      |
| **Live / random**            | WebSocket message or colleague’s POST | WebSocket / `POST …/random` | **Store** (via **`liveSession*`** events)                     | **`sessionsLoaded`** only                   |

**`<cfb-updates-sessions>`** stays on the **HTTP** row only. That is intentional: you can add real-time features **without** rewriting the form layer.

### WebSocket lifecycle

- **`new WebSocket(url)`** - URL includes **`eventId`**: `ws://localhost:3001/ws/sessions/codefreeze-2025`.
- **`open`** - connection accepted; show status in the UI (`data-state="open"`).
- **`message`** - parse JSON; handle **`sessionUpdated`** and **`sessionRemoved`**.
- **`close`** / **`error`** - update status; optional extras: reconnect with back-off.
- **`disconnectedCallback`** - **`this.#socket?.close()`** so leaving the page does not leak connections.

### Store wrapper pattern

**`<cfb-session-store-updates>`** is the **single write boundary** for session IndexedDB:

| Child event | Store action | Outbound event |
|-------------|--------------|----------------|
| **`sessionsFetched`** | **`saveSessions`** (bulk replace) | **`sessionsLoaded`** |
| **`liveSessionUpdated`** | **`upsertSession`** | **`sessionsLoaded`** |
| **`liveSessionRemoved`** | **`deleteSession`** | **`sessionsLoaded`** |

Children **bubble** events; the store listens on **self** and does not import loader or WebSocket classes.

### Orchestrator tweak

Step 7 waited for **both** **`scheduleLoaded`** and **`sessionsLoaded`** before the first paint. After that, 
a **solo** **`sessionsLoaded`** (live push or session reload) should still bump **`data-latest-updated-at`** on 
**`.listens-schedule-updates`**. See [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js).

### End-to-end flow (reference)

Legend:
- [ ] ✨ new / changed in Step 8 ·
- [ ] ✅ unchanged from earlier steps
```
                        ┌────────────┐
                        │ Page load  │
                        └─────┬──┬───┘
              on page load,   │  │   connect to WebSocket
              it loads data   │  │   on page load
                              ▼  ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
  │              ✨ cfb-session-store-updates                                │
  │  ┌──────────────────────────┐    ┌──────────────────────────────────┐    │
  │  │ ✨ cfb-session-loader    │    │ ✨ cfb-live-session-updates      │    │
  │  │    (fetch only)          │    │    (WebSocket listen only)       │    │
  │  └────────────┬─────────────┘    └──────────────────┬───────────────┘    │
  │               │ sessionsFetched                     │ liveSessionUpdated │
  │               │                                     │ liveSessionRemoved │
  │               └──────────────────┬──────────────────┘                    │
  │                                  ▼                                       │
  │                         saveSessions / upsert / delete                   │
  └──────────────────────────────────┬───────────────────────────────────────┘
                                     │
                                     ▼
                            ┌────────────────┐
                            │   IndexedDB    │
                            └────────┬───────┘
                                     │ sessionsLoaded (bubbles)
                                     ▼
                         ┌───────────────────────┐
                         │ cfb-board-orchestrator│
                         └───────────┬───────────┘
                                     │ data-latest-updated-at
                                     ▼
                            ┌────────────────┐
                            │  cfb-schedule  │  ✅ read IDB → render cards
                            └────────────────┘


  PULL - form add / edit / remove (✅ cfb-updates-sessions unchanged)

  cfb-add-session-form ──► cfb-updates-sessions ──PUT/PATCH/DELETE──► API (step-8-be)
                                    │
                                    │ sessionsBackendUpdated
                                    ▼
                         cfb-board-orchestrator ──reload──► cfb-session-loader
                                                              (back into store ↑)


  PUSH - random session (simulates another user)

  cfb-initiate-a-random-session-creation ──POST /random──► API (step-8-be)
                                                              │
                                                              │ WebSocket push
                                                              ▼
                                              cfb-live-session-updates
                                                              │
                                                              └──► store ↑
```

A Mermaid version lives in [`images/flowchart`](./images/flowchart).

---

### One-minute review (~1 min)

Complete [One-minute review](./learning-log.md#step-8-concepts-one-minute) in your learning log.

---

### Concept check

Do **two** short activities in your [learning log](./learning-log.md).

1. **Mini quiz** - [Mini quiz](./learning-log.md#step-8-concept-quiz): answer from memory first.
2. **Two-path sketch** - [Two-path sketch](./learning-log.md#step-8-concept-two-path-sketch): pull vs push boxes.

When both are done, move on to **Concrete practice**.

---

## 3) Concrete practice

### Starting point

Copy **`step-7/`** into your working tree **or** use this folder’s reference files. You need a working Step 7 board (loaders, orchestrator, **`cfb-updates-sessions`**, forms).

**Backend:** run **`step-8-be`** - not optional for core exercises.

### Build order (suggested)

Work in this order; check off as you go:

1. **Refactor `<cfb-session-loader>`**  
   - Remove **`saveSessions`** from the loader.  
   - On success, dispatch **`sessionsFetched`** with **`{ eventId, sessions }`**.  
   - Keep **`data-reload-token`** / **`.listens-session-reloads`** behaviour from Step 7.

2. **Add `<cfb-session-store-updates>`**  
   - Listen for **`sessionsFetched`**, **`liveSessionUpdated`**, **`liveSessionRemoved`**.  
   - Call **`saveSessions`** / **`upsertSession`** / **`deleteSession`** from [`../step-7/lib/store/session-store.js`](../step-7/lib/store/session-store.js).  
   - Dispatch **`sessionsLoaded`** after each write (same shape as Step 7).

3. **Add `<cfb-live-session-updates>`**  
   - Build URL: **`${data-url}/${data-event-id}`**.  
   - On **`sessionUpdated`** / **`sessionRemoved`**, dispatch **`liveSession*`** events (do **not** import the session store here).  
   - Close socket in **`disconnectedCallback`**.  
   - Surface connection state on the element (`data-state`, status text).

4. **Extend `<cfb-board-orchestrator>`**  
   - When **`sessionsLoaded`** arrives and the board already has a **`currentEventId`**, refresh **`.listens-schedule-updates`** even if **`scheduleLoaded`** is not in the same batch.

5. **Add `<cfb-initiate-a-random-session-creation>`**  
   - Button → **`POST /api/sessions/:eventId/random`** via **`backend-api`**.  
   - Do **not** update IDB here - wait for the WebSocket push (simulates another user).

6. **Wire [`index.html`](./index.html)**  
   - Wrap loader + live component inside **`<cfb-session-store-updates>`**.  
   - Set **`data-url="ws://localhost:3001/ws/sessions"`** and matching **`data-event-id`**.  
   - Register new elements in [`index.js`](./index.js); extend the event-switcher to update live + random button ids.

7. **Extend `backend-api`** (if not present)  
   - **`postRandomSession(eventId)`**  
   - **`deleteSession(eventId, sessionId)`** on **`<cfb-updates-sessions>`** for card **Remove** (Step 7 gap).

### Files to read (reference implementation)

| File | Role |
|------|------|
| [`cfb-session-store-updates.js`](./cfb-session-store-updates.js) | Single IDB write boundary; emits **`sessionsLoaded`** |
| [`cfb-session-loader.js`](./cfb-session-loader.js) | Fetch only → **`sessionsFetched`** |
| [`cfb-live-session-updates.js`](./cfb-live-session-updates.js) | WebSocket → **`liveSession*`** events |
| [`cfb-initiate-a-random-session-creation.js`](./cfb-initiate-a-random-session-creation.js) | POST random session (backend pushes to WS) |
| [`cfb-updates-sessions.js`](./cfb-updates-sessions.js) | **Unchanged role** - HTTP for form + remove |
| [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) | Initial dual load + incremental **`sessionsLoaded`** |
| [`lib/api/backend-api.js`](./lib/api/backend-api.js) | **`postRandomSession`**, **`deleteSession`** |
| [`index.html`](./index.html) | Component tree and status pills |

This folder ships as a **reference implementation** - your job is to **trace, demo, and complete the learning log**, or rebuild following the list above on your branch.

**Build / trace until you can show:**

- [ ] **Live pill** shows **`open`** with **`step-8-be`** running.
- [ ] **Random session** button adds a card in **this** tab; a **second tab** on the same event updates too.
- [ ] **Remove** on a card deletes via HTTP and the card disappears (and stays gone after refresh).
- [ ] **Add / edit form** still works - trace that **`cfb-updates-sessions`** never opens a WebSocket.
- [ ] You can name the **three** event types the store listens for and the **one** event it emits upward.

**Constraints**

- HTML, JavaScript, and CSS only - **no** frameworks inside custom elements.
- Target about **45 minutes** for core tracing + log activities.
- **`step-8-be`** provides HTTP + WebSocket; MSW WebSocket mocking is an **optional extra** (see Extras).

**Definition of done**

- You can draw **pull** and **push** paths to the same schedule refresh without peeking.
- You complete [Question for your facilitator](./learning-log.md#step-8-concrete-facilitator-question) with one genuine question.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log - Quick check](./learning-log.md#step-8-conclusions-quick-check).

### 2) Loop back

Update [Push vs pull](./learning-log.md#step-8-loop-back-push-vs-pull).

### 3) PLAN prompts

- [Pull vs push](./learning-log.md#step-8-conclusions-pull-vs-push)  
- [True / False - close socket](./learning-log.md#step-8-conclusions-tf-close-socket)  
- [True / False - separate render path](./learning-log.md#step-8-conclusions-tf-render-path)

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-8-key-takeaway).

---

### Demos / issues

- Share a short screen recording: random button + second browser tab receiving the same update.
- Note blockers in your learning log or ping your facilitator.

---

## Tips

### WebSocket URL with `eventId`

```js
const wsUrl = `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(eventId)}`
this.#socket = new WebSocket(wsUrl)
```

### Live component - dispatch only, no IDB

```js
if (type === 'sessionUpdated' && session) {
  this.dispatchEvent(new CustomEvent('liveSessionUpdated', {
    bubbles: true,
    composed: true,
    detail: { eventId: session.eventId, session },
  }))
}
```

### HTML shell (core new wrapper)

```html
<cfb-session-store-updates>
  <cfb-session-loader class="listens-session-reloads" data-event-id="codefreeze-2025">
  </cfb-session-loader>
  <cfb-live-session-updates
    data-event-id="codefreeze-2025"
    data-url="ws://localhost:3001/ws/sessions">
  </cfb-live-session-updates>
</cfb-session-store-updates>
```

**`<cfb-updates-sessions>`** stays **outside** this wrapper - same place as Step 7.

---

## Extras

If you finish early:

- [ ] **Reconnect** with exponential back-off when the socket closes unexpectedly.
- [ ] **MSW WebSocket** handler (`ws.link`) to demo push without **`step-8-be`** - see [`../PLAN.md`](../PLAN.md) Step 8 snippet.
- [ ] Dispatch a separate **`liveUpdate`** event so the UI can flash the card that changed.
- [ ] Open **two events** (`codefreeze` vs `devdays`) in two tabs - confirm WebSocket traffic is **scoped** to **`eventId`** only.

---

### End result (skills you can demonstrate)

- **`WebSocket`** lifecycle and cleanup in custom elements
- **Single responsibility** - fetch vs listen vs store vs HTTP mutations
- **Reusing** **`sessionsLoaded`** / orchestrator / schedule **pull** from Step 7
- **Collaborative UX** - random POST + broadcast simulates another user’s change
