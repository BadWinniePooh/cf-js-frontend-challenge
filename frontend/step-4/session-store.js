// Promise-based IndexedDB wrapper for session data.
// Single responsibility: all IDB access lives here — no UI, no events.
// DB_NAME is exported so tests can delete the database between runs.

const SEED_SESSIONS = [
  {
    id: "cf25-1",
    title: "Opening Keynote",
    day: "Wednesday",
    room: "Main Hall",
    tags: [{ label: "Keynote", color: "blue" }],
    attendees: [
      { initials: "AK", name: "Alice Kent" },
      { initials: "JS", name: "James Smith" },
    ],
  },
  {
    id: "cf25-2",
    title: "Web Components Deep Dive",
    day: "Wednesday",
    room: "Track A",
    tags: [
      { label: "Frontend", color: "green" },
      { label: "Workshop", color: "orange" },
    ],
    attendees: [
      { initials: "TL", name: "Thomas Lee" },
      { initials: "PK", name: "Priya Kapoor" },
    ],
  },
  {
    id: "cf25-3",
    title: "TDD in the Browser",
    day: "Thursday",
    room: "Track B",
    tags: [{ label: "Testing", color: "purple" }],
    attendees: [
      { initials: "AK", name: "Alice Kent" },
      { initials: "HV", name: "Henry Vance" },
      { initials: "JO", name: "Julia Owen" },
    ],
  },
  {
    id: "cf25-4",
    title: "IndexedDB Patterns",
    day: "Thursday",
    room: "Track A",
    tags: [
      { label: "Frontend", color: "green" },
      { label: "Data", color: "red" },
    ],
    attendees: [{ initials: "MR", name: "Maria Rodriguez" }],
  },
  {
    id: "cf25-5",
    title: "Accessibility by Default",
    day: "Friday",
    room: "Track A",
    tags: [{ label: "A11y", color: "green" }],
    attendees: [
      { initials: "LM", name: "Liam Miller" },
      { initials: "KR", name: "Kara Reed" },
    ],
  },
  {
    id: "cf25-6",
    title: "Closing Panel",
    day: "Friday",
    room: "Main Hall",
    tags: [{ label: "Keynote", color: "blue" }],
    attendees: [
      { initials: "AK", name: "Alice Kent" },
      { initials: "JS", name: "James Smith" },
      { initials: "TL", name: "Thomas Lee" },
    ],
  },
];

export const DB_NAME = "cfb-local-db";
const DB_VERSION = 1;

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

export async function saveSessions(sessions) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessions", "readwrite");
    const store = transaction.objectStore("sessions");
    sessions.forEach((session) => {
      store.add(session);
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
}

export async function seedIfEmpty() {
  const sessions = await getAllSessions();
  if (sessions.length === 0) {
    await saveSessions(SEED_SESSIONS);
  }
}

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
