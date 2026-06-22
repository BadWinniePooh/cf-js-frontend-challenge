import { getAllSessions, saveSessions, SEED_SESSIONS } from './session-store.js'
import { cfbSessionsLoadedToIDB } from './lib/events.js'

// Single responsibility: load all sessions from the server - store to IndexedDB.
// In real life, this probably would have a 'last updated' timestamp, and would
// only load new sessions if the last update was newer than the last time it
// loaded.
export class CfbSessionLoader extends HTMLElement {
  static elementName = 'cfb-session-loader'

  async connectedCallback() {
    // ✨ mimic loading all sessions from Backend, and storing them to IndexedDB!
    // Hint: you can use the `SEED_SESSIONS` below to store the data.

    // ✨ Inform up the DOM that events are stored in IndexedDB, see [events.js](./events.js)
    // for a helper method for making an event
  }
}
