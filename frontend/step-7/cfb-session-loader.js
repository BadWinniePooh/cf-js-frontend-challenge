import { getBackendApi } from './lib/api/backend-api.js'

export class CfbSessionLoader extends HTMLElement {
    static get observedAttributes() {
        return ['data-event-id', 'data-reload-token']
    }

    connectedCallback() {
        this.#setStatus('initialized', `fetching sessions for "${this.dataset.eventId}"…`)
        this.#load(this.dataset.eventId)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue) return

        if (name === 'data-event-id' && newValue) {
            this.#load(newValue)
        } else if (name === 'data-reload-token' && newValue) {
            this.#load(this.dataset.eventId)
        }
    }

    async #load(eventId) {
        this.#setStatus('loading', `fetching sessions for "${eventId}"…`)

        try {
            const sessions = await getBackendApi().getSessions(eventId)
            // TODO: here, read json,
            // TODO: store to IDB,
            // TODO: and send an event up the DOM
        } catch (err) {
            this.#setStatus('error', `failed: ${err.message}`)

            this.dispatchEvent(new CustomEvent('loaderError', {
                bubbles: true,
                composed: true,
                detail: { loader: 'sessions', eventId, error: err.message },
            }))
        }
    }

    #setStatus(state, message) {
        // small helper method for UI to see what's happening
        this.dataset.state = state
        this.textContent = `[session-loader] ${message}`
    }
}
