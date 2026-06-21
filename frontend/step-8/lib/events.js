import { EventTypes as Step7EventTypes } from '../../step-7/lib/events.js'

export {
  cfbSessionCreated,
  cfbSessionsLoadedToIDB,
} from '../../step-7/lib/events.js'

export const EventTypes = {
  ...Step7EventTypes,
  INITIAL_SESSION_RECEIVED: 'cfb-session-data-received',
}

export const cfbInitialSessionData = (eventId, sessions) => new CustomEvent(EventTypes.INITIAL_SESSION_RECEIVED, {
  bubbles: true,
  composed: true,
  detail: { eventId, sessions, _type: EventTypes.INITIAL_SESSION_RECEIVED },
})

export const cfbSessionUpdated = (eventId, session) => new CustomEvent(EventTypes.SESSION_UPDATED, {
  bubbles: true,
  composed: true,
  detail: { eventId, session, _type: EventTypes.SESSION_UPDATED },
})

export const cfbSessionRemoved = (eventId, sessionId) => new CustomEvent(EventTypes.SESSION_REMOVED, {
  bubbles: true,
  composed: true,
  detail: { eventId, sessionId, _type: EventTypes.SESSION_REMOVED },
})