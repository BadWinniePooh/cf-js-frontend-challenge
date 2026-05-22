import { cfbSessionStored, EventTypes } from './lib/events.js'

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
    // TODO: Call backendApi to save session
    this.#notifySaved(eventId)
  }

  #onSessionUpdated = async (e) => {
    const eventId = this.dataset.eventId
    if (!eventId) return
    e.stopPropagation()

    const session = e.detail
    // TODO: Call backendApi to update session
    this.#notifySaved(eventId)
  }

  #notifySaved(eventId) {
    this.dispatchEvent(cfbSessionStored({ eventId, updatedAt: Date.now() }))
  }
}
