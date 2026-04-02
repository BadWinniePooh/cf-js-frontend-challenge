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

// TODO: Implement the needed functions for IndexedDB here

export async function getAllSessions() {
  return SEED_SESSIONS;
  // TODO: Implement this function to retrieve all sessions from the 'sessions' object store
}

export async function deleteSession(id) {
  // TODO: Implement this function to delete a session by its ID from the 'sessions' object store
}

export async function saveSessions(sessions) {
  // TODO: Implement this function to save a session to the 'sessions' object store
}

export async function seedIfEmpty() {
  // TODO: Implement this function to check if the 'sessions' object store is empty and, if so, populate it with SEED_SESSIONS
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

