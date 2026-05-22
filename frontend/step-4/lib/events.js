export {cfbSessionCreated, cfbSessionRemoved} from '../step-3/events.js'

export const EventTypes = {
  SESSION_CREATED: 'cfb-session-created',
  SESSION_REMOVED: 'cfb-session-removed',
  SESSION_LOADED_TO_IDB: 'cfb-sessions-loaded-to-idb',
}

export const cfbSessionsLoadedToIDB = () => new CustomEvent(EventTypes.SESSION_LOADED_TO_IDB, {
  bubbles: true,
  composed: true,
  detail: { _type: EventTypes.SESSION_LOADED_TO_IDB },
})