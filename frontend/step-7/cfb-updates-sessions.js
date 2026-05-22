import { cfbSessionUpdated, EventTypes } from './lib/events.js'
import { getBackendApi } from './lib/api/backend-api.js'

export class CfbUpdatesSessions extends HTMLElement {
  connectedCallback() {
    this.addEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
    this.addEventListener(EventTypes.SESSION_UPDATED, this.#onSessionUpdated)
  }

  disconnectedCallback() {
    this.removeEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
    this.removeEventListener(EventTypes.SESSION_UPDATED, this.#onSessionUpdated)
  }

  #onSessionCreated = async (e) => {
    const eventId = this.dataset.eventId
    if (!eventId) return
    e.stopPropagation()

    const session = e.detail
    await getBackendApi().putSession(eventId, session.id, session)
    this.#notifySaved(eventId)
  }

  #onSessionUpdated = async (e) => {
    const eventId = this.dataset.eventId
    if (!eventId) return
    e.stopPropagation()

    const session = e.detail
    await getBackendApi().patchSession(eventId, session.id, session)
    this.#notifySaved(eventId)
  }

  #notifySaved(eventId) {
    this.dispatchEvent(cfbSessionUpdated({ eventId, updatedAt: Date.now() }))
  }
}
