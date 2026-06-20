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
    /* code here */

    // NOTE: This is important - because we want to notify the parent component that the session has been updated, so
    // that it can update the UI.
    this.#notifySaved(eventId)
  }

  #onSessionUpdated = async (e) => {
    const eventId = this.dataset.eventId
    if (!eventId) return
    e.stopPropagation()

    const session = e.detail
    // TODO: Call backendApi to update session
    /* code here */

    // NOTE: This is important - because we want to notify the parent component that the session has been updated, so
    // that it can update the UI.
    this.#notifySaved(eventId)
  }

  #notifySaved(eventId) {
    // TODO: you should dispatch an event to notify the parent component that the sessions in backend has been updated
    // this.dispatchEvent( /* make a custom event here */)
  }
}
