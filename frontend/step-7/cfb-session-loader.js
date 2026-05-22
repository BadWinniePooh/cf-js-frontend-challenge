import { getBackendApi } from './lib/api/backend-api.js'

export class CfbSessionLoader extends HTMLElement {
    static get observedAttributes() {
        return []
    }

    connectedCallback() {
        this.#setStatus('initialized', `fetching sessions for "${this.dataset.eventId}"…`)
        // TODO: Load sessions for initial eventId
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // TODO: Load sessions if eventId changes, or when orchestrator says 'reload'
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
