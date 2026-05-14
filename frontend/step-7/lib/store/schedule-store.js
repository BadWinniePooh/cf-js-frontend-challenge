// Promise-based IndexedDB wrapper for schedule metadata only.
// Default export returns store methods and keeps one DB connection per page load.

const DB_NAME = 'cfb-schedule-db'
const DB_VERSION = 1
let dbPromise = null
let storeInstance = null

function openDb() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION)

        req.onupgradeneeded = (e) => {
            const db = e.target.result

            if (!db.objectStoreNames.contains('schedule')) {
                db.createObjectStore('schedule', { keyPath: 'eventId' })
            }

            if (!db.objectStoreNames.contains('sessions')) {
                const store = db.createObjectStore('sessions', { keyPath: 'id' })
                store.createIndex('by-event', 'eventId', { unique: false })
            }
        }

        req.onsuccess = (e) => resolve(e.target.result)
        req.onerror = (e) => reject(e.target.error)
    })
}

export default function createScheduleStore() {
    if (!dbPromise) {
        dbPromise = openDb()
    }

    if (storeInstance) {
        return storeInstance
    }

    storeInstance = {
        async saveSchedule(schedule) {
            const db = await dbPromise
            return new Promise((resolve, reject) => {
                const tx = db.transaction('schedule', 'readwrite')
                tx.objectStore('schedule').put(schedule)
                tx.oncomplete = () => resolve()
                tx.onerror = (e) => reject(e.target.error)
            })
        },

        async getSchedule(eventId) {
            const db = await dbPromise
            return new Promise((resolve, reject) => {
                const req = db.transaction('schedule', 'readonly')
                    .objectStore('schedule')
                    .get(eventId)
                req.onsuccess = (e) => resolve(e.target.result ?? null)
                req.onerror = (e) => reject(e.target.error)
            })
        },
    }

    return storeInstance
}
