import { cfbSessionRemoved, cfbSessionUpdated } from './lib/events.js'

export class CfbLiveSessionUpdates extends HTMLElement {
  static elementName = 'cfb-live-session-updates'

  #socket = null // This is the websocket
  #wsBaseUrl = null
  #eventId = null

  static get observedAttributes() {
    return ['data-event-id', 'data-url']
  }

  connectedCallback() {
    this.#connect()
    this.#wsBaseUrl = this.dataset.url.replace(/\/+$/, '') // to remove trailing slash
    this.#eventId = this.dataset.eventId
    if(this.#eventId && this.#wsBaseUrl) {
      // Connect if you know both
      this.#connect()
    }
  }

  disconnectedCallback() {
    // TODO: close WebSocket connection
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return
    if (name === 'data-url' && newValue) {
      this.#wsBaseUrl = newValue.replace(/\/+$/, '')
    }
    if (name === 'data-event-id') {
      this.#eventId = newValue
    }
    if(this.#eventId && this.#wsBaseUrl) {
      // Connect if you know both
      this.#connect()
    }
  }

  #connect() {

    // TODO: connect to WebSocket

    // TODO: implement the 4 lifecycle event handlers of WebSocket
  }

  #onMessage(event) {
    const { type, session, sessionId, eventId } = JSON.parse(event.data)

    // TODO: Here your job is to send the event up the DOM, based on the type of the event received:
    // So, either send
    // this.dispatchEvent(cfbSessionUpdated(session.eventId, session))

    // or
    // this.dispatchEvent(cfbSessionRemoved(eventId, sessionId))
  }

  // Helper method for UI to see what's happening
  #setStatus(state, message) {
    this.dataset.state = state
    this.textContent = `[live-updates] ${message}`
  }
}
