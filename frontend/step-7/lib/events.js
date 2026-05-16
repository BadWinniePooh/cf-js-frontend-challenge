import {
  cfbSessionCreated,
  cfbSessionRemoved,
  EventTypes as Step5EventTypes,
} from '../../step-5/lib/events.js'

export { cfbSessionCreated, cfbSessionRemoved }

export const EventTypes = {
  ...Step5EventTypes,
  SESSION_UPDATED: 'cfb-session-updated',
  SCHEDULE_LOADED: 'cfb-schedule-loaded',
  SESSIONS_LOADED: 'cfb-sessions-loaded',
}

export const cfbScheduleLoaded = session => {
  throw new Error('Not implemented')
}

export const cfbSessionsLoaded = session => {
  throw new Error('Not implemented')
}

export const cfbSessionStored = session => {
  throw new Error('Not implemented')
}