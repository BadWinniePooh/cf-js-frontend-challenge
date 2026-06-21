import { getBackendApi } from './lib/api/backend-api.js'
import { cfbInitialSessionData } from './lib/events.js'

export class CfbSessionLoader extends HTMLElement {
  static elementName = 'cfb-session-loader'

  static get observedAttributes() {
    return ['data-event-id', 'data-reload-token']
  }

  connectedCallback() {
    const eventId = this.dataset.eventId
    if (eventId) this.#load(eventId)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-event-id' && newValue && newValue !== oldValue) {
      this.#load(newValue)
    }
    if (
      name === 'data-reload-token' &&
      newValue &&
      newValue !== oldValue &&
      this.dataset.eventId
    ) {
      this.#load(this.dataset.eventId)
    }
  }

  async #load(eventId) {
    this.#setStatus('loading', `fetching sessions for "${eventId}"…`)

    try {
      const sessions = await getBackendApi().getSessions(eventId)
      this.#setStatus('done', `${sessions.length} sessions fetched`)

      // Change from step-7 is that this no longer stores data to IndexedDB, but sends a custom event to
      this.dispatchEvent(cfbInitialSessionData(eventId, sessions))
    } catch (err) {
      this.#setStatus('error', `failed: ${err.message}`)

      this.dispatchEvent(
        new CustomEvent('loaderError', {
          bubbles: true,
          composed: true,
          detail: { loader: 'sessions', eventId, error: err.message },
        })
      )
    }
  }

  #setStatus(state, message) {
    this.dataset.state = state
    this.textContent = `[session-loader] ${message}`
  }
}
