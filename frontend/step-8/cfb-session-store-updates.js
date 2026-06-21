import { saveSessions, upsertSession, deleteSession } from '../step-7/lib/store/session-store.js'
import { EventTypes } from './lib/events.js'

export class CfbSessionStoreUpdates extends HTMLElement {
  static elementName = 'cfb-session-store-updates'

  connectedCallback() {
    this.addEventListener(EventTypes.INITIAL_SESSION_RECEIVED, this.#onSessionsFetched)
    this.addEventListener(EventTypes.SESSION_UPDATED, this.#onLiveSessionUpdated)
    this.addEventListener(EventTypes.SESSION_REMOVED, this.#onLiveSessionRemoved)
  }

  disconnectedCallback() {
    this.removeEventListener(EventTypes.INITIAL_SESSION_RECEIVED, this.#onSessionsFetched)
    this.removeEventListener(EventTypes.SESSION_UPDATED, this.#onLiveSessionUpdated)
    this.removeEventListener(EventTypes.SESSION_REMOVED, this.#onLiveSessionRemoved)
  }

  #onSessionsFetched = async (e) => {
    const { eventId, sessions } = e.detail
    await saveSessions(sessions)
    this.#emitSessionsLoaded(eventId)
  }

  #onLiveSessionUpdated = async (e) => {
    const { eventId, session } = e.detail
    // TODO: Update the data in IndexedDB & emit an event for the orchestrator
  }

  #onLiveSessionRemoved = async (e) => {
    const { eventId, sessionId } = e.detail
    // TODO: Update the data in IndexedDB & emit an event for the orchestrator
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
