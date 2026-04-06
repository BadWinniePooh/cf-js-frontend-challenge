import { getAllSessions, saveSessions } from './session-store.js'
import { cfbSessionsLoadedToIDB } from './events.js'

// Single responsibility: load all sessions from the server - store to IndexedDB.
// In real life, this probably would have a 'last updated' timestamp, and would
// only load new sessions if the last update was newer than the last time it
// loaded.
export class CfbSessionLoader extends HTMLElement {
  async connectedCallback() {
    // ✨ mimic loading all sessions from Backend, and storing them to IndexedDB!
    // Hint: you can use the `SEED_SESSIONS` below to store the data.

    // ✨ Inform up the DOM that events are stored in IndexedDB, see [events.js](./events.js)
    // for a helper method for making an event
  }
}

const SEED_SESSIONS = [
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

