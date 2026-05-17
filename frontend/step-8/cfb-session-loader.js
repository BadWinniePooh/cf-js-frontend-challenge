import { getBackendApi } from './lib/api/backend-api.js'

export class CfbSessionLoader extends HTMLElement {
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

      this.dispatchEvent(
        new CustomEvent('sessionsFetched', {
          bubbles: true,
          composed: true,
          detail: { eventId, sessions },
        })
      )
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
