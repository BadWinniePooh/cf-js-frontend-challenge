# Step 4 — Load from IndexedDB

In Steps 1–3 you built UI and **in-memory** flows. Refreshing the page dropped session state. Now sessions **persist in 
the browser** using **IndexedDB** — same origin as your app — while keeping **storage code separate** from components.

The **full wiring** (database name, event type strings, loader vs store) lives in **Concepts** and in 
**`session-store.js`/ `events.js`** — after **Connections** — so your first guesses in the learning log stay honest.

> **Before you start:** branch, HTTP server, **same origin** for IDB — see [getting-started.md](./getting-started.md).

### Async / solo

Use [your Step 4 learning log](./learning-log.md), a short message to your facilitator or team, or a brief sync when the README says 
“pair.” **Short timeboxes** matter more than the format.

---

## Learning goal

By the end of this step, you can:

- Open (or upgrade) an **IndexedDB** database with a **`sessions`** object store and **Promise**-based helpers.
- Describe **who reads/writes** session rows (`session-store.js`) vs **who only reacts** to signals (loader, store wrapper, schedule).
- Explain how **`cfb-sessions-loaded-to-idb`** triggers a **downward “poke”** via **`data-latest-updated-at`** so 
  **`cfb-schedule`** **pulls fresh rows from IDB** instead of receiving a giant JSON blob from the orchestrator.

---

## 1) Connections

Do these **in order**; capture answers in [your Step 4 learning log](./learning-log.md).

1. **Solo, ~2 min — Refresh the page**  
   [Refresh the page](./learning-log.md#step-4-connections-refresh) *(revisit in Conclusions).*

2. **Solo, ~5 min — Orchestrator vs Step 3**  
   [Orchestrator from Step 3](./learning-log.md#step-4-connections-orchestrator-step3).

3. **Solo, ~3 min — Bridge from Step 3**  
   [Bridge from Step 3](./learning-log.md#step-4-bridge-step-3).

4. **Optional pair / async, ~3 min**  
   [Surprise / compare](./learning-log.md#step-4-connections-surprise).

5. **Solo, ~2 min — Topic link**  
   [Topic link](./learning-log.md#step-4-topic-link): **A** or **B**.

---

## 2) Concepts

### IndexedDB in one paragraph

**IndexedDB** is an **async**, **structured** client-side database (not a simple key/value string map). You **open** a 
database by **name + version**; **`onupgradeneeded`** creates **object stores** and **indexes**. Reads/writes happen 
inside **transactions**. This repo wraps those callbacks in **`Promise`**s inside **`session-store.js`**.

### Storage vs UI (`session-store.js`)

**Rule of thumb:** **`session-store.js`** owns **`indexedDB`** only — **no** DOM, **no** `CustomEvent`. Components 
**call** `getAllSessions()`, `saveSessions()`, `deleteSession()`, etc., and decide what to render or dispatch.

The database **name** used in code is the exported **`DB_NAME`** in [`session-store.js`](./session-store.js) (in this repo 
**`cfb-db-test`** so tests can isolate DBs — adjust only if you know why).

### Events (`events.js`)

[`events.js`](./lib/events.js) is the **single place** for Step 4 event constants:

| Constant                | String                           | Typical use                                                               |
|-------------------------|----------------------------------|---------------------------------------------------------------------------|
| `SESSION_CREATED`       | **`cfb-session-created`**        | Re-exported from Step 3 — generator → store                               |
| `SESSION_REMOVED`       | **`cfb-session-removed`**        | Remove menu → store                                                       |
| `SESSION_LOADED_TO_IDB` | **`cfb-sessions-loaded-to-idb`** | Loader finished seeding **or** store finished mutating IDB → orchestrator |

Factories: **`cfbSessionsLoadedToIDB()`**, **`cfbSessionRemoved(...)`**, plus **`cfbSessionCreated`** from Step 3.

### DOM layout (this repo)

See [`index.html`](./index.html):

```html
<cfb-board-orchestrator>
  <cfb-session-loader></cfb-session-loader>
  <cfb-session-store>
    <cfb-session-generator></cfb-session-generator>
    <cfb-schedule class="listens-schedule-updates"></cfb-schedule>
  </cfb-session-store>
</cfb-board-orchestrator>
```

**`<cfb-session-store>`** wraps the generator + schedule so **`cfb-session-created`** and **`cfb-session-removed`** 
bubble **through** it; it writes IDB then dispatches **`cfbSessionsLoadedToIDB()`** so the orchestrator hears **one** 
uniform “data changed” signal.

### End-to-end flow (reference)

Legend:
- [ ]: ✅ This is already provided
- [ ]: 🚧 Partly done, part of this exercise
- [ ]: ✨ New features, core of the exercise

**Initial load**

```
✅ index.js — registers custom elements on **page load**
    │
    ▼
✨ cfb-session-loader
    [connectedCallback: This mimics a call to backend to fetch data, and stores them to IndexedDB]
    On page load, seeds IndexedDB with SEED_SESSIONS, if IndexedDB is empty
           |
           ▼
          ✨ session-store.js ✨
          Stores data to session-store. 
    And dispatches an event saying 'all data is loaded into IndexedDB'
    |
    ▼
🚧 cfb-board-orchestrator
    listens to 'cfb-sessions-loaded-to-idb'
    informs all children that have 'listens-schedule-updates' that 'now there is new data in IndexedDb'.
    Does not read IndexedDB / pass the data down - that will be done by the components directly.
    │  attribute change goes DOWN
    ▼
🚧 cfb-schedule
    observedAttributes → data-latest-updated-at
    → ✨ Reads data from IndexedDB 
    → ✅ re-renders session cards
```

**Add / remove session** (same “data changed” signal)

```
✅ cfb-session-generator → cfb-session-created   ─┐
✅ cfb-session-card menu → cfb-session-removed   ─┼─ bubble through <cfb-session-store>
                                                  │
✨ cfb-session-store                              │                         
    listens to both the events                    │
    → Updates IndexedDB                           │ 
    → Dispatches an event UP                      │
    │ bubbles UP                                  │
    ▼                                             │
                                                  │
🚧 cfb-board-orchestrator (same as initial load) ◄┘
```

Why **`data-latest-updated-at`** instead of pushing **`data-sessions`** JSON from the orchestrator? The orchestrator **does not ship the array** — it only signals **“re-read from IDB”**; **`cfb-schedule`** pulls **`getAllSessions()`** after the timestamp changes.

Session rows still render as **`<cfb-session-card data-session-details='…'>`** using **`sessionDetails`** shape from [`../step-2/lib/builds-session-details.js`](../step-2/lib/builds-session-details.js).

---

### One-minute review (~1 min)

Complete [One-minute review](./learning-log.md#step-4-concepts-one-minute) in your learning log.

---

### Concept check — two parts

Do this in your [learning log](./learning-log.md):

1. **[Mini quiz](./learning-log.md#step-4-concept-quiz)** — three short questions *before* you lean only on copy-paste.

Then continue to **Concrete practice**.

---

## 3) Concrete practice

Work **in reading order** (matches [`index.html`](./index.html) comment block):

| File                                                          | Focus                                                                    |
|---------------------------------------------------------------|--------------------------------------------------------------------------|
| ✨ [`session-store.js`](./session-store.js)                    | implement IndexedDb functionality to save & retrieve sessions            |
| ✅ [`events.js`](./lib/events.js)                              | See how events are created & types made reusable                         |
| ✨ [`cfb-session-loader.js`](./cfb-session-loader.js)          | when attached to DOM, initializes store                                  |
| 🚧 [`cfb-board-orchestrator.js`](./cfb-board-orchestrator.js) | orchestrating the flow between events.                                   |
| 🚧 [`cfb-schedule.js`](./cfb-schedule.js)                     | **`data-latest-updated-at`** → **`getAllSessions()`** → render           |
| ✨ [`cfb-session-store.js`](./cfb-session-store.js)            | listens to 'session generated'/'session removed' and stores to indexedDB |

**Below is step-by-step guidance for each file.**

### ✨ `session-store.js` — Promise-based IDB wrapper

This is the main part of this exercise. The goal is to learn how to write an IndexedDB connection

- [ ] `openDb()` — open (or create) a database named `cfb-db` at version 1
- [ ] On `onupgradeneeded`: create a `sessions` object store keyed on `id`
- [ ] `saveSessions(sessions[])` — write (or overwrite) a batch of sessions
- [ ] `getAllSessions()` — return all sessions as an array

### 🚧 `cfb-session-loader.js` — Organism

- [ ] when attached to dom, seed the IndexedDB with initial data (if it has no data)
- [ ] Dispatches an event to inform that 'there is data in IndexedDB'

### 🚧 `cfb-board-orchestrator.js` — Organism

- [ ] when attached to dom, register event listeners
- [ ] listen to 'there is data in IndexedDB'
- [ ] informs the relevant children that 'btw, new data in IndexedDB'
   - Might use a `data-latest-updated-at` attribure with timestamp

### 🚧 `cfb-schedule.js` — Organism

- [ ] change listening from 'data-session-details' to 'data-latest-updated-at'
- [ ] read sessions from IDB, and re-render

### 🚧 `cfb-session-store.js` — Organism

- [ ] listen to 'session generated'/'session removed' events
- [ ] update (save or delete) data in IDB
- [ ] dispatch event 'cfbSessionsLoadedToIDB' for orchestrator to hear

### After building these, you can:

- [ ] Build a component that **loads** sessions from IDB on page load
- [ ] Add event listener for **adding a new session** to IDB.
- [ ] And seeing how this can be gradually added to the previous steps.

**Constraints**

- HTML, JavaScript, and CSS only — no frameworks.
- Aim for about **30–45 minutes** on the core challenge.

**Definition of done**

- You can point to **`session-store.js`** as the **only** module that calls **`indexedDB.open`** for sessions.
- You can explain **`cfb-sessions-loaded-to-idb`** vs **`cfb-session-created`** in one sentence each.

In [Question for your facilitator](./learning-log.md#step-4-facilitator-question), ask one question and capture the answer.

---

## 4) Conclusions

### 1) Quick check

Answer in [your learning log — Quick check](./learning-log.md#step-4-conclusions-quick-check).

### 2) Ticket out

Complete [Ticket out](./learning-log.md#step-4-conclusions-ticket-out): one best insight from this step + one improvement idea for your next IDB practice.

### 3) Loop back

Update [Refresh the page](./learning-log.md#step-4-loop-back-refresh).

### 4) Key takeaway (journey hub)

Add **one or two sentences** in the [journey hub `learning-log.md`](../learning-log.md#step-4-key-takeaway).

---

### Demos / issues

- Share a short screen recording if you want feedback.
- If you get stuck, note it in your learning log or ping your facilitator.

---

## Tips

### Opening and versioning the database

```js
const req = indexedDB.open('cfb-db', 1)

req.onupgradeneeded = (e) => {
    const db = e.target.result
    if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'id' })
    }
}

req.onsuccess = (e) => {
    const db = e.target.result
    // use db here
}
```

`onupgradeneeded` only fires when the database does not exist yet (or the
version number increases). Your seed data goes here so it only runs once.


### Wrapping IDB in Promises

The raw IDB API is callback-based. Wrap each operation in a `Promise` to keep
your code readable:

```js
function getAllSessions() {
    return new Promise((resolve, reject) => {
        const req = db.transaction('sessions', 'readonly')
            .objectStore('sessions')
            .getAll()
        req.onsuccess = (e) => resolve(e.target.result)
        req.onerror   = (e) => reject(e.target.error)
    })
}
```

### Session shape

[`sessionDetails`](../step-2/lib/builds-session-details.js) / Step 2 **`data-session-details`** JSON stay the **contract** for cards.

---

## Extras

If you finish early:

- [ ] Ensure **every** new random session is **persisted** (trace **`cfb-session-created`** → store → IDB).
- [ ] Add **`getSessionsByDay(day)`** usage per column (index **`by-day`** already exists in **`session-store.js`**).
- [ ] Cursor / sorted **`getAll`** variants for title order.
- [ ] **Remove session path** *(wired in this repo)* — You can add a flow to remove session (see below)

### remove session
- Each session card has a `⋯` menu with a **Remove** button.
- Clicking it fires a `cfb-session-removed` event (defined in [events.js](./events.js)) that bubbles up to `<cfb-session-store>`.
- The store deletes the entry from IDB via `deleteSession(id)` (which you need to implement),
- and fires `sessionsLoaded` the same path used for initial load and adding sessions.
- To see this working, refresh the page and the removed session stays gone.
- Key files: `cfb-session-card.js`, `events.js`, `cfb-session-store.js`, `session-store.js`

**Data flow:**

✅ cfb-menu (open menu)
│
▼
✅ cfb-session-card (press 'remove' button')
create new event
│    │
│    ▼
│    ✅ events.js
│        create the new event
▼
🚧 cfb-session-store
deletes session from session store
│    │
│    ▼
│    ✅ session-store
│        remove session from IndexedDB
And dispatches an event up the chain
▼
✅ cfb-board-orchestrator

---

### End result (skills you can demonstrate)

- **IndexedDB**: open, version, object store, **`keyPath`**, transactions, **`getAll`**
- **Promises** wrapping callback APIs
- **Separation**: **`session-store.js`** vs UI components
- **Signals**: **`cfb-sessions-loaded-to-idb`** + **`data-latest-updated-at`** refresh pattern
- **`sessionDetails`**-compatible rows end-to-end
