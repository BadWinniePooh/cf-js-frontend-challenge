import {
  cfbSessionCreated,
  cfbSessionRemoved,
  cfbSessionsLoadedToIDB,
  EventTypes as Step4EventTypes,
} from '../step-4/events.js'
import { sessionDetails } from '../step-2/lib/builds-session-details.js'

export { cfbSessionCreated, cfbSessionRemoved, cfbSessionsLoadedToIDB }

export const EventTypes = {
  ...Step4EventTypes,
  SESSION_UPDATED: 'cfb-session-updated',
}

export const cfbSessionUpdated = session =>
  new CustomEvent(EventTypes.SESSION_UPDATED, {
    bubbles: true,
    composed: true,
    detail: { ...sessionDetails(session), _type: EventTypes.SESSION_UPDATED },
  })
