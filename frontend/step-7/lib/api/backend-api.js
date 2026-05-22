const DEFAULT_BASE_URL = 'http://localhost:3001'

function createBackendApi(baseUrl) {
  return {
    async getSchedule(eventId) {
      const res = await fetch(`${baseUrl}/api/schedule/${encodeURIComponent(eventId)}`)
      if (!res.ok) throw new Error(`Failed to fetch schedule: ${res.status}`)
      return res.json()
    },
    async getSessions(eventId) {
      const res = await fetch(`${baseUrl}/api/sessions/${encodeURIComponent(eventId)}`)
      if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`)
      return res.json()
    },
    async putSession(eventId, sessionId, payload) {
      const res = await fetch(`${baseUrl}/api/sessions/${encodeURIComponent(eventId)}/${encodeURIComponent(sessionId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Failed to update session: ${res.status}`)
      return res.json()
    },
    async patchSession(eventId, sessionId, payload) {
      const res = await fetch(`${baseUrl}/api/sessions/${encodeURIComponent(eventId)}/${encodeURIComponent(sessionId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Failed to patch session: ${res.status}`)
      return res.json()
    },
    async deleteSession(eventId, sessionId) {
      const res = await fetch(`${baseUrl}/api/sessions/${encodeURIComponent(eventId)}/${encodeURIComponent(sessionId)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`Failed to delete session: ${res.status}`)
      return res.json()
    },
  }
}

let backendApi = createBackendApi(DEFAULT_BASE_URL)

// With ESM, this works basically like a singleton. And, because of we do testing with web-test-runner,
// there is an easy way to now fake the backend API for testing purposes. We do that easily by using
// importMaps. But that's a topic for 'test-7'
export function getBackendApi() {
  return backendApi
}

export function configureBackendApi(input) {
  backendApi = createBackendApi(input.baseUrl)
}
