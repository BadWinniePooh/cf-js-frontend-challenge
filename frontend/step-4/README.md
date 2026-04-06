# Step 4 — Load from IndexedDB

In the previous steps you composed components and wired them together with
events. All data was hardcoded. Now you will replace hardcoded HTML with data
that lives in the browser's own database — **IndexedDB**.

**Learning Goal**: Implement your first IndexedDB store, and integrate that into 
the current flow.

---

## The data flow

Legend:
✅: This is already provided
🚧: Partly done, part of this exercise
✨: New features, core of the exercise

```
✅ index.html
    page load
    │
    ▼
✅ index.js 
    Initializes the app
    │
    ▼
✨ cfb-session-loader.js 
    [This mimics a call to backend to fetch data, and stores them to IndexedDB]
    On page load, seeds IndexedDB with SEED_SESSIONS, if IndexedDB is empty
    (this mimics a http fetch to a backend) 
           |
           ▼
          ✨ session-store.js ✨
          Stores data to session-store. 
    And dispatches an event saying 'all data is loaded into IndexedDB'
    |
    ▼
🚧 cfb-board-orchestrator 
    informs all children that have 'listens-schedule-updates' that 
    'now there is new data in IndexedDb'.
    Does not read IndexedDB / pass the data down - that will be done
    by the components directly.
    │  attribute change goes DOWN
    ▼
🚧 cfb-schedule 
    observedAttributes → data-latest-updated-at
    → ✨ Reads data from IndexedDB 
    → ✅ re-renders session cards
  
-- When generating a session ( Extras step 1) --
  
✅ cfb-session-generator ✅
    dispatches sessionCreated {bubbles:true}
    │ bubbles UP
    ▼
✨cfb-session-store ✨ 
    listens to the sessionCreated event
    → Updates the session to IndexedDB
    → Dispatches an event UP
    │ bubbles UP
    ▼
✅ cfb-board-orchestrator ✅ (same as above)
    informs all children that have 'listens-schedule-updates' of 'data-updated-at'
    │  attribute change goes DOWN
    │  
    ▼
cfb-schedule 🚧. (same as above)
```

---

## What to build

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

---

## Constraints

- HTML, JavaScript and CSS only. No frameworks.
- Max 30 minutes.

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

see [build-session-details.js](../step-2/builds-session-details.js)

---

## Extras

- [ ] When adding a session with the 'Add random session' button, make sure that that gets
      stored in indexedDB.
- [ ] Wrap the IndexedDB API in a small Promise-based helper module
      (`session-store.js`) so `index.js` never touches raw IDB callbacks
- [ ] Add a `day` index and use `getSessionsByDay(day)` to load sessions per
      column instead of loading everything and filtering in JS
- [ ] Use a cursor with a `direction` parameter to iterate sessions in
      alphabetical title order
- [ ] **Remove a session from IndexedDB** *(already implemented)*
      Each session card has a `⋯` menu with a **Remove** button. Clicking it
      fires a `cfb-session-removed` event (defined in [events.js](./events.js)) that bubbles
      up to `<cfb-session-store>`. The store deletes the entry from IDB via
      `deleteSession(id)` (which you need to implement), re-reads the full list, and fires `sessionsLoaded` —
      the same path used for initial load and adding sessions. 
      Refresh the page and the removed session stays gone.
      Key files: `cfb-session-card.js`, `events.js`, `cfb-session-store.js`,
      `session-store.js` (`deleteSession`).

### Data flow of remove session

✅ cfb-menu (open menu)
    page load
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

## Issues / notes

If you get stuck, note down the problem here so we can discuss it together.

### End result

After completing this step you will have learned:

- How to work with IndexedDb: 
  - Opening and versioning an IndexedDB database (`onupgradeneeded`)
  - `IDBObjectStore` — `put`, `getAll`, cursor iteration
- Wrapping callback-style async in `Promise`
- Bridging async storage to synchronous component rendering
- How to orchestrate messages between 'sibling' DOM elements through an ancestor
  - using events and 
  - attributes
- How to inform all the child elements that 'new data is available in IndexedDb'