export const WS_SESSIONS_PATH_PREFIX = '/ws/sessions/'

export function wsSessionsPath(eventId) {
  return `${WS_SESSIONS_PATH_PREFIX}${encodeURIComponent(eventId)}`
}

export function parseWsEventId(pathname) {
  if (!pathname.startsWith(WS_SESSIONS_PATH_PREFIX)) return null
  const eventId = pathname.slice(WS_SESSIONS_PATH_PREFIX.length)
  if (!eventId || eventId.includes('/')) return null
  return decodeURIComponent(eventId)
}

export function createBroadcaster(wss) {
  return {
    sessionUpdated(session) {
      broadcast(wss, session.eventId, { type: 'sessionUpdated', session })
    },
    sessionRemoved(eventId, sessionId) {
      broadcast(wss, eventId, { type: 'sessionRemoved', eventId, sessionId })
    },
  }
}

export function broadcast(wss, eventId, payload) {
  const message = JSON.stringify(payload)
  for (const client of wss.clients) {
    if (client.readyState === 1 && client.eventId === eventId) {
      client.send(message)
    }
  }
}
