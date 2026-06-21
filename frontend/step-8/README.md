# Step 8 - Live Updates with WebSocket

Step 7 taught **pull**: loaders **`fetch`** data, write IndexedDB, and the orchestrator refreshes the schedule. In
Step 7, we also made an explicit call to backend to fetch updated sessions. In real applications, making regular such
calls would not be efficient. Instead, we can use **push** updates via **WebSocket**.

This is exactly the goal of Step 8.
We add a **WebSocket** feed (in backend) that the frontend can **listen** to. Then the backend can **broadcast** session
changes to all listeners, and the listener can then update the IndexedDB, inform the orchestrator and do all the
necessary hoops to make the UI fluent

We also see that the HTML structure from step-7 is also well suited for **push** updates, with a minor change, which
also will make responsibilities of custom elements clearer. Basically, we split the responsibility of
[`session-loader`](../step-7/cfb-session-loader.js) into two parts:

- load sessions from backend,
- store session data into IndexedDB.

^^ **This is the key change** from Step 7. And while doing this, the component that stores session data into IndexedDB
also handles the updates to IndexedDB that comes from the live updates.

The part from Step 7 that deals with schedule, adding/removing/updating sessions is unchanged.

The backend (**[`step-8-be`](../step-8-be/README.md)**) is **already provided**. It supports now (in addition to what
step-7 backend):

- WebSocket broadcast,
- Adding a random session
- Deleting a session

> **Before you start:** branch, HTTP server from **`frontend/`**, **`step-8-be`** running -
> see [getting-started.md](./getting-started.md).

### Async / solo

Use [your Step 8 learning log](./learning-log.md), a short note to your facilitator, or a sync when the README says
“compare.” **Timeboxes** beat polish.

---

## Learning goal

By the end of this step, you can:

- Open a **`WebSocket`** connection, parse received **`message`** payloads, and **close** the socket in
  **`disconnectedCallback`**.
- Treat architecture as replaceable boundaries: having organisms that have clear responsibilities and who play well
  together.
- Add real-time features to the schedule (without rewriting core components).
- Describe the difference between **pull** data and **push**  with WebSocket while having the same structure as in
  Step-7

---

## 1) Connections

Do these **in order**; capture answers in [your Step 8 learning log](./learning-log.md).

1. **Solo, ~2 min - Think → ink (push vs pull)**  
   [Push vs pull](./learning-log.md#step-8-connections-push-vs-pull) *(revisit
   in [Loop back](./learning-log.md#step-8-loop-back-push-vs-pull)).*

2. **Solo, ~4 min - Bridge from Step 7**  
   [Bridge from Step 7](./learning-log.md#step-8-bridge-step-7).

3. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-8-connections-surprise).

4. **Solo, ~2 min - Topic link**  
   [Topic link](./learning-log.md#step-8-topic-link): answer **A** or **B**.

---

## 2) Concepts

Modern web apps do not rely on just fetching data implicitly from the server. Instead, to make a board like CFB work,
all changes done by other participants should be visible immediately. One way to achieve this is to use WebSockets to
receive updates from the server.
> **Note:** WebSockets are not the only way to achieve this.

### Pushing data from backend to the client.

WebSockets are a two-way communication protocol that allows the server to push data to the client in real-time. This is
useful for applications that require real-time updates, such as chat applications, online games, and collaborative
editing tools. In the context of CFB, WebSockets can be used to push updates to the client when a session is created,
updated, or deleted.

in [step-8-be](../step-8-be/src/server.js), the server is implementing WebSockets to push updates to the client when a
session is created, updated, or deleted - or when someone else adds a sessions (which is faked with the 'create random
session' button).

### Pull vs push in this app

Initially, we had a **pull** architecture for data. We keep that on the initial page load. We pull the data from
backend, store it in IndexedDB and then render the schedule. The biggest change from step-7 is that we no longer need to
pull the data again when we do any changes to the sessions.

The responsibilities are:

- [`CfbSessionLoader`](./cfb-session-loader.js): Makes the initial fetch for sessions. Sends an event to:
- [`CfbSessionStoreUpdates`](./cfb-session-store-updates.js): who listens to events related updates to sessions, and
  stores them to the IndexedDB. Once the store is updated, it emits an event to:
- [`CfbBoardOrchestrator`](./cfb-board-orchestrator.js): who does what is has done for a long time - informs the:
- [`CfbSchedule`](../step-4/cfb-schedule.js): who retrieves all the sessions from the IndexedDB and renders them.

In the mean time:

- [`CfbLiveSessionUpdates`](./cfb-live-session-updates.js): registers itself to listen to the WebSocket connection.
  When a message is received, It parses the message and dispatches an event to:
- [`CfbSessionStoreUpdates`](./cfb-session-store-updates.js): who updates the IndexedDB and informs the:
- [`CfbBoardOrchestrator`](./cfb-board-orchestrator.js): who ... (you know the drill by now)

There is no change in [`CfbUpdatesSessions`](./cfb-updates-sessions.js), but how that is handled in the Orchestrator has
changed - now the orchestrator only writes into a console.log, but in real app, it might show a small toast if on a
browser.

### WebSocket lifecycle

The lifecycle of a WebSocket connection is (see [`cfb-live-session-updates.js`](./cfb-live-session-updates.js)):

First we create a new WebSocket connection to the correct URL:

```javascript
const wsUrl = `${baseUrl}/${eventId}` // simplified version
const socket = new WebSocket(wsUrl)
this.#socket = socket
```

Then we need to add handlers for the connection lifecycle events:

- open
- message
- close
- error

You add an event handler by calling `socket.addEventListener(eventName, handler)`. For example:

```javascript
socket.addEventListener('message', (e) => {
  this.#onMessage(e)
})
```

#### 'open' event

The **`open`** event is fired when the connection is established. Here it just sets the status to show it in the UI.

#### 'message' event

The **`message`** event is fired when a message is received from the server. So when the backend broadcasts a message
to all WebSocket clients, this 'message' event is fired on the client side. Here we need to handle the event by parsing
the message and then doing the necessary business logic.
In our case, it means we either update a session or remove a session - by sending a custom event up the DOM tree.

#### 'close' event

The close event is fired when the connection is closed.

#### 'error' event

The error event is fired when an error occurs on the connection.

### Store wrapper pattern

In this step, we introduce a new Atomic Design organism, **`<cfb-session-store-updates>`**. This is the **single write
boundary** for session IndexedDB, the behavior of which is to listen to specific events and then update the IndexedDB
accordingly. Below is a table of relevant events and their corresponding store actions.

Note: For simplicyty sake, there is no separate event for 'updated' and 'created' from the WebSockets. But maybe as an
Extra...

| Child event                               | Store action                     | 
|-------------------------------------------|----------------------------------|
| **`EventTypes.INITIAL_SESSION_RECEIVED`** | **`saveSessions`** (replace all) | 
| **`EventTypes.SESSION_UPDATED`**          | **`upsertSession`**              |
| **`EventTypes.SESSION_REMOVED`**          | **`deleteSession`**              |

If you separate update & create, the store would not need an 'upsert' method, but would work totally with the version
from 'step-4'

In the end of each handler, the store will emit a single event: **`sessionsLoaded`** for the Orchestrator to know that
the sessions have
been updated in IndexedDB.

### Orchestrator tweak

Orchestrator no longer triggers a reload of sessions from backend - instead, it logs something to a console.

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
  │               │ sessionsFetched                     │ session Updated    │
  │               │                                     │ session Removed    │
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


```

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

To implement a web socket connection, you need to:

- implement the WebSocket lifecycle events in [`cfb-live-session-updates.js`](./cfb-live-session-updates.js)
- implement the listeners in the [`cfb-session-store-updates.js`](./cfb-session-store-updates.js) to update data in
  IndexedDB & inform the Orchestrator.

Remember to have 'step-8-be' running for this exercise.

**Constraints**

- HTML, JavaScript, and CSS only - **no** frameworks inside custom elements.
- Target about **45 minutes** for core tracing + log activities.
- **`step-8-be`** provides HTTP + WebSocket

**Definition of done**

- You can draw **pull** and **push** paths to the same schedule refresh without implicit fetch after updates.
- You complete [Question for your facilitator](./learning-log.md#step-8-concrete-facilitator-question) with one
  question.

---

In [your learning log - Question for your facilitator](./learning-log.md#step-8---concrete-practice-question-for-your-facilitator).:
Add a question for your facilitator and log the answer in the learning log.

---

## 4) Conclusions

In this step, you learned how to connect to a WebSocket server and receive updates from the server.
And how to structure HTML in a way that data flows nicely and each component has a single and clear responsibility.

This is the last step of the CFB 8-step process of learning modern web development.

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

- [ ] Implement the 'created' flow from the backend -> Adding a session sends 'created' while updated sends 'updated'.
  What are the places you needed to change code?
- [ ] **Reconnect** with exponential back-off when the socket closes unexpectedly.
- [ ] **MSW WebSocket** handler (`ws.link`) to demo push without **`step-8-be`** - see [`../PLAN.md`](../PLAN.md) Step 8
  snippet.
- [ ] Dispatch a separate **`liveUpdate`** event so the UI can flash the card that changed.
- [ ] Open **two events** (`codefreeze` vs `devdays`) in two tabs - confirm WebSocket traffic is **scoped** to *
  *`eventId`** only.

---

### End result (skills you can demonstrate)

- **`WebSocket`** lifecycle and cleanup in custom elements
- **Single responsibility** - fetch vs listen vs store vs HTTP mutations
- **Reusing** **`sessionsLoaded`** / orchestrator / schedule **pull** from Step 7
- **Collaborative UX** - random POST + broadcast simulates another user’s change
