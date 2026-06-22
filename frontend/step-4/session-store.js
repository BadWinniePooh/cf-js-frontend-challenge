// Promise-based IndexedDB wrapper for session data.
// Single responsibility: all IDB access lives here - no UI, no events.
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

// These are seed sessions for step-4
export const SEED_SESSIONS = [
  {
    id: 'cf25-1',
    title: 'Opening Keynote',
    day: 'Wednesday',
    room: 'Main Hall',
    tags: [{ label: 'Keynote', color: 'blue' }],
    attendees: [
      { initials: 'AK', name: 'Alice Kent' },
      { initials: 'JS', name: 'James Smith' },
    ],
    sessionType: 'Keynote',
  },
  {
    id: 'cf25-2',
    title: 'Web Components Deep Dive',
    day: 'Wednesday',
    room: 'Track A',
    tags: [
      { label: 'Frontend', color: 'green' },
      { label: 'Workshop', color: 'orange' },
    ],
    attendees: [
      { initials: 'TL', name: 'Thomas Lee' },
      { initials: 'PK', name: 'Priya Kapoor' },
    ],
    sessionType: 'Workshop',
  },
  {
    id: 'cf25-3',
    title: 'TDD in the Browser',
    day: 'Thursday',
    room: 'Track B',
    tags: [{ label: 'Testing', color: 'purple' }],
    attendees: [
      { initials: 'AK', name: 'Alice Kent' },
      { initials: 'HV', name: 'Henry Vance' },
      { initials: 'JO', name: 'Julia Owen' },
    ],
    sessionType: 'Talk',
  },
  {
    id: 'cf25-4',
    title: 'IndexedDB Patterns',
    day: 'Thursday',
    room: 'Track A',
    tags: [
      { label: 'Frontend', color: 'green' },
      { label: 'Data', color: 'red' },
    ],
    attendees: [
      { initials: 'MR', name: 'Maria Rodriguez' },
    ],
    sessionType: 'Talk',
  },
  {
    id: 'cf25-5',
    title: 'Accessibility by Default',
    day: 'Friday',
    room: 'Track A',
    tags: [{ label: 'A11y', color: 'green' }],
    attendees: [
      { initials: 'LM', name: 'Liam Miller' },
      { initials: 'KR', name: 'Kara Reed' },
    ],
  },
  {
    id: 'cf25-6',
    title: 'Closing Panel',
    day: 'Friday',
    room: 'Main Hall',
    tags: [{ label: 'Keynote', color: 'blue' }],
    attendees: [
      { initials: 'AK', name: 'Alice Kent' },
      { initials: 'JS', name: 'James Smith' },
      { initials: 'TL', name: 'Thomas Lee' },
    ],
  },
]

