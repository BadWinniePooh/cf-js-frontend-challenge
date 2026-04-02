export const EventTypes = {
  SESSION_CREATED: 'cfb-session-created',
  SESSION_REMOVED: 'cfb-session-removed',
}

export const cfbSessionRemoved = sessionId => new CustomEvent(EventTypes.SESSION_REMOVED, {
  bubbles: true,
  composed: true,
  detail: { sessionId, _type: EventTypes.SESSION_REMOVED },
})