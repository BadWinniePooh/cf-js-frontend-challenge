// Promise-based IndexedDB wrapper for session data.
// Single responsibility: all IDB access lives here — no UI, no events.
// Same DB_NAME as step-4/session-store.js so schedule reads this DB.
// DB_NAME is exported so tests can delete the database between runs.

export const DB_NAME = 'cfb-db-test'
const DB_VERSION = 2

function openDb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (e) => {
            const db = e.target.result
            if (!db.objectStoreNames.contains('sessions')) {
                const store = db.createObjectStore('sessions', { keyPath: 'id' })
                store.createIndex('by-day', 'day', { unique: false })
            }
        }

        req.onsuccess = (e) => resolve(e.target.result)
        req.onerror   = (e) => reject(e.target.error)
    })
}

export async function saveSessions(sessions) {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sessions', 'readwrite')
        const store = tx.objectStore('sessions')
        store.clear()
        for (const session of sessions) {
            store.put(session)
        }
        tx.oncomplete = () => resolve()
        tx.onerror    = (e) => reject(e.target.error)
    })
}

export async function upsertSession(session) {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sessions', 'readwrite')
        tx.objectStore('sessions').put(session)
        tx.oncomplete = () => resolve()
        tx.onerror    = (e) => reject(e.target.error)
    })
}

export async function updateSession(session) {
    const db = await openDb()
    const existing = await new Promise((resolve, reject) => {
        const req = db
            .transaction('sessions', 'readonly')
            .objectStore('sessions')
            .get(session.id)
        req.onsuccess = (e) => resolve(e.target.result)
        req.onerror   = (e) => reject(e.target.error)
    })
    if (existing === undefined) {
        throw new Error(`Session not found: ${session.id}`)
    }
    return new Promise((resolve, reject) => {
        const tx    = db.transaction('sessions', 'readwrite')
        tx.objectStore('sessions').put(session)
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

export async function deleteSession(id) {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const tx = db.transaction('sessions', 'readwrite')
        tx.objectStore('sessions').delete(id)
        tx.oncomplete = () => resolve()
        tx.onerror    = (e) => reject(e.target.error)
    })
}

export async function getSessionsByDay(day) {
    const db = await openDb()
    return new Promise((resolve, reject) => {
        const req = db
            .transaction('sessions', 'readonly')
            .objectStore('sessions')
            .index('by-day')
            .getAll(day)
        req.onsuccess = (e) => resolve(e.target.result)
        req.onerror   = (e) => reject(e.target.error)
    })
}
