const DEFAULT_BASE_URL = 'http://localhost:3001'

function createBackendApi(baseUrl) {
  return {
    getSchedule(eventId) {
      throw new Error('Not implemented')
    },
    getSessions(eventId) {
      throw new Error('Not implemented')
    },
    putSession(eventId, sessionId, payload) {
      throw new Error('Not implemented')
    },
    patchSession(eventId, sessionId, payload) {
      throw new Error('Not implemented')
    },
    async deleteSession(eventId, sessionId) {
      throw new Error('Not implemented')
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
