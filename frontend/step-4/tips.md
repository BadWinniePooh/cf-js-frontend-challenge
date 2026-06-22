# Tips

## Opening and versioning the database

When opening the database, you define the name and the version number.
The version number is used to trigger the `onupgradeneeded` event when the database is opened with a higher
version number than the current version. In these examples, we're always using just the `1` version number - but it is
crucial nevertheless, because this is the only way to create a new database.

```js
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains('sessions')) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' }) // 'sessions' is the object store name
        store.createIndex('by-day', 'day', { unique: false }) // just to show you can make indexes, too
      }
    }

    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}
```

`onupgradeneeded` only fires when the database does not exist yet (or the version number increases). Your seed data goes
here so it only runs once.

## Wrapping IDB in Promises

The raw IDB API is callback-based. Wrap each operation in a `Promise` to keep your code readable:

All reading/writing happens through transactions - you do that by explicitly asking for 'readonly' or 'readwrite' access:

```javascript
export async function saveSessions(sessions) {
  const db = await openDb() // use the 'openDb' function from above
  return new Promise((resolve, reject) => {
    const tx    = db.transaction('sessions', 'readwrite') // explicit 'readwrite' access
    const store = tx.objectStore('sessions')
    for (const session of sessions) {
      store.put(session)
    }
    tx.oncomplete = () => resolve()
    tx.onerror    = (e) => reject(e.target.error)
  })
}

export async function getAllSessions() {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const req = db
      .transaction('sessions', 'readonly')
      .objectStore('sessions')
      .getAll()
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror   = (e) => reject(e.target.error)
  })
}
```

---
