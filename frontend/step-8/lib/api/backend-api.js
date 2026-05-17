const DEFAULT_BASE_URL = 'http://localhost:3001'

function trimTrailingSlash(url) {
  return String(url).replace(/\/+$/, '')
}

function createBackendApi(baseUrl) {
  const normalizedBaseUrl = trimTrailingSlash(baseUrl)

  async function fetchJson(path, init = {}) {
    const res = await fetch(`${normalizedBaseUrl}${path}`, init)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (res.status === 204) return null
    return res.json()
  }

  async function sendJson(method, path, payload) {
    const res = await fetch(`${normalizedBaseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`${method} failed: HTTP ${res.status}`)
  }

  return {
    getSchedule(eventId) {
      return fetchJson(`/api/schedule/${eventId}`)
    },
    getSessions(eventId) {
      return fetchJson(`/api/sessions/${eventId}`)
    },
    putSession(eventId, sessionId, payload) {
      return sendJson('PUT', `/api/sessions/${eventId}/${sessionId}`, payload)
    },
    patchSession(eventId, sessionId, payload) {
      return sendJson('PATCH', `/api/sessions/${eventId}/${sessionId}`, payload)
    },
    postRandomSession(eventId) {
      return fetchJson(`/api/sessions/${eventId}/random`, { method: 'POST' })
    },
    async deleteSession(eventId, sessionId) {
      const res = await fetch(
        `${normalizedBaseUrl}/api/sessions/${eventId}/${sessionId}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error(`DELETE failed: HTTP ${res.status}`)
    },
  }
}

let backendApi = createBackendApi(DEFAULT_BASE_URL)

export function configureBackendApi({ baseUrl }) {
  backendApi = createBackendApi(baseUrl ?? DEFAULT_BASE_URL)
  return backendApi
}

export function getBackendApi() {
  return backendApi
}
