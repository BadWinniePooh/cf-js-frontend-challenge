# Step 4 — Load from IndexedDB

In the previous steps you composed components and wired them together with
events. All data was hardcoded. Now you will replace hardcoded HTML with data
that lives in the browser's own database — **IndexedDB**.

---

## The data flow

```
page load
    │
    ▼
index.js
    checks if sessions exist in IndexedDB
    if empty → seeds with SEED_SESSIONS (optional)
    │
    ▼
getAllSessions()   ← reads from IndexedDB
    │
    ▼
render(sessions)
    groups by day → builds column HTML
    inserts <cfb-session-card> per session
```

---

## What to build

### `session-store.js` — Promise-based IDB wrapper

- [x] `openDb()` — open (or create) a database named `cfb-db` at version 1
- [x] On `onupgradeneeded`: create a `sessions` object store keyed on `id`
- [x] `saveSessions(sessions[])` — write (or overwrite) a batch of sessions
- [x] `getAllSessions()` — return all sessions as an array

### `index.js` — Application bootstrap

- [ ] On page load, check how many sessions are already in the DB
- [ ] If none exist, seed the store with at least 5 conference sessions
      (fields: `id`, `title`, `day`, `room`, `tags`, `attendees`)
- [ ] Call `getAllSessions()` and pass the result to a `render()` function
- [ ] `render()` groups sessions by day, creates one `.cfb-column` per day
      and one `<cfb-session-card>` per session inside it

### `index.html`

- [ ] A board container (`<div id="board">`) where `render()` injects columns
- [ ] Import `index.js` as a `type="module"` script

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

```js
{
    id:        'cf25-1',
    title:     'Opening Keynote',
    day:       'Wednesday',
    room:      'Main Hall',
    tags:      [{ label: 'Keynote', color: 'blue' }],
    attendees: [{ initials: 'AK', name: 'Alice Kent' }],
}
```

---

## Extras

- [ ] Wrap the IndexedDB API in a small Promise-based helper module
      (`session-store.js`) so `index.js` never touches raw IDB callbacks
- [ ] Add a `day` index and use `getSessionsByDay(day)` to load sessions per
      column instead of loading everything and filtering in JS
- [ ] Use a cursor with a `direction` parameter to iterate sessions in
      alphabetical title order
- [x] **Remove a session from IndexedDB** *(already implemented)*
      Each session card has a `⋯` menu with a **Remove** button. Clicking it
      fires a `cfb-session-removed` event (defined in `events.js`) that bubbles
      up to `<cfb-session-store>`. The store deletes the entry from IDB via
      `deleteSession(id)`, re-reads the full list, and fires `sessionsLoaded` —
      the same path used for initial load and adding sessions. Refresh the page
      and the removed session stays gone.
      Key files: `cfb-session-card.js`, `events.js`, `cfb-session-store.js`,
      `session-store.js` (`deleteSession`).

---

## Learning goals

- Opening and versioning an IndexedDB database (`onupgradeneeded`)
- `IDBObjectStore` — `put`, `getAll`, cursor iteration
- `IDBIndex` for filtered queries
- Wrapping callback-style async in `Promise`
- Bridging async storage to synchronous component rendering

---

## Issues / notes

If you get stuck, note down the problem here so we can discuss it together.
