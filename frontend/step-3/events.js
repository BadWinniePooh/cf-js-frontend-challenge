import { sessionDetails } from '../step-2/lib/builds-session-details.js'

export const EventTypes = {
  SESSION_CREATED: 'cfb-session-created',
  SESSION_REMOVED: 'cfb-session-removed',
}

export const cfbSessionCreated = data => new CustomEvent(EventTypes.SESSION_CREATED, {
  bubbles: true,
  composed: true,
  detail: { ...sessionDetails(data), _type: EventTypes.SESSION_CREATED },
})

export const cfbSessionRemoved = sessionId => new CustomEvent(EventTypes.SESSION_REMOVED, {
        bubbles: true,
        detail: { sessionId: sessionId },
      })