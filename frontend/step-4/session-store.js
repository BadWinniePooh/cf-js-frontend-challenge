// Promise-based IndexedDB wrapper for session data.
// Single responsibility: all IDB access lives here — no UI, no events.
// DB_NAME is exported so tests can delete the database between runs.

export const DB_NAME = 'cfb-db-test'
const DB_VERSION = 1

function openDb() {
  // ✨ Implement
}

export async function saveSessions(sessions) {
  // ✨ Implement
}

export async function updateSession(session) {
  // ✨ Implement
}

export async function getAllSessions() {
  // ✨ Implement
}

export async function deleteSession(id) {
  // ✨ Implement
}
