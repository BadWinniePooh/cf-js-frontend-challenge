// Promise-based IndexedDB wrapper for session data.
// Single responsibility: all IDB access lives here — no UI, no events.
// DB_NAME is exported so tests can delete the database between runs.

export const DB_NAME = 'cfb-db'
const DB_VERSION = 1

let dbPromise = null;

function openDb() {
    // already open, return the existing promise
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, _) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("sessions")) {
        db.createObjectStore("sessions", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
  });

  return dbPromise;
}

export async function saveSessions(sessions) {
 const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    sessions.forEach((session) => {
      store.put(session);
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

export async function updateSession(session) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    store.put(session);
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

export async function getAllSessions() {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readonly");
    const store = transaction.objectStore("sessions");
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function deleteSession(id) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
