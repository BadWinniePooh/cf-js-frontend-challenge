import { EventTypes as Step3EventTypes } from '../../step-3/lib/events.js'

export {cfbSessionCreated} from '../../step-3/lib/events.js'

export const EventTypes = {
  ...Step3EventTypes,
  SESSION_REMOVED: 'cfb-session-removed',
  SESSION_LOADED_TO_IDB: 'cfb-sessions-loaded-to-idb',
}

export const cfbSessionRemoved = sessionId => new CustomEvent(EventTypes.SESSION_REMOVED, {
  bubbles: true,
  composed: true,
  detail: { sessionId, _type: EventTypes.SESSION_REMOVED },
})

export const cfbSessionsLoadedToIDB = () => new CustomEvent(EventTypes.SESSION_LOADED_TO_IDB, {
  bubbles: true,
  composed: true,
  detail: { _type: EventTypes.SESSION_LOADED_TO_IDB },
})

