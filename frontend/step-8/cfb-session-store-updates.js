import { saveSessions, upsertSession, deleteSession } from '../step-7/lib/store/session-store.js'

export class CfbSessionStoreUpdates extends HTMLElement {
  static elementName = 'cfb-session-store-updates'

  connectedCallback() {
    this.addEventListener('sessionsFetched', this.#onSessionsFetched)
    this.addEventListener('liveSessionUpdated', this.#onLiveSessionUpdated)
    this.addEventListener('liveSessionRemoved', this.#onLiveSessionRemoved)
  }

  disconnectedCallback() {
    this.removeEventListener('sessionsFetched', this.#onSessionsFetched)
    this.removeEventListener('liveSessionUpdated', this.#onLiveSessionUpdated)
    this.removeEventListener('liveSessionRemoved', this.#onLiveSessionRemoved)
  }

  #onSessionsFetched = async (e) => {
    const { eventId, sessions } = e.detail
    await saveSessions(sessions)
    this.#emitSessionsLoaded(eventId)
  }

  #onLiveSessionUpdated = async (e) => {
    const { eventId, session } = e.detail
    await upsertSession(session)
    this.#emitSessionsLoaded(eventId)
  }

  #onLiveSessionRemoved = async (e) => {
    const { eventId, sessionId } = e.detail
    await deleteSession(sessionId)
    this.#emitSessionsLoaded(eventId)
  }

  #emitSessionsLoaded(eventId) {
    this.dispatchEvent(
      new CustomEvent('sessionsLoaded', {
        bubbles: true,
        composed: true,
        detail: { eventId, updatedAt: Date.now() },
      })
    )
  }
}
