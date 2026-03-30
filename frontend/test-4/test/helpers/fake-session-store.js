/**
 * In-memory implementation of the session-store.js API.
 *
 * Exports the same named functions as the real store so it can be used as a
 * drop-in substitute in tests that don't need a real IndexedDB.
 *
 * Extra exports (prefixed _) are test-only helpers:
 *   resetForTests() — wipe state between tests (equivalent to dropping the real DB)
 *   _seed(sessions) — pre-populate state without going through the event pipeline
 */

export const DB_NAME = 'fake-db'

const FAKE_SEED = [
  {
    id:        'seed-1',
    title:     'Seed Session',
    day:       'Wednesday',
    room:      'Main Hall',
    tags:      [{ label: 'Keynote', color: 'blue' }],
    attendees: [{ name: 'Alice Kent', initials: 'AK' }],
  },
]

let _store = []

export async function saveSessions(sessions) {
  for (const s of sessions) {
    const idx = _store.findIndex(x => x.id === s.id)
    if (idx >= 0) _store[idx] = s
    else _store.push(s)
  }
}

export async function getAllSessions() {
  return [..._store]
}

export async function deleteSession(id) {
  _store = _store.filter(s => s.id !== id)
}

export async function getSessionsByDay(day) {
  return _store.filter(s => s.day === day)
}

export async function seedIfEmpty() {
  if (_store.length === 0) await saveSessions(FAKE_SEED)
}

/** Teardown: wipe all in-memory state. Call in afterEach. */
export async function resetForTests() {
  _store = []
}

/** Setup: replace the store contents in one call. */
export function _seed(sessions) {
  _store = [...sessions]
}
