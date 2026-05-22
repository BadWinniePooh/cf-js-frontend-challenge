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
            // read session from backend API
            const sessions = await getBackendApi().getSessions(eventId)
            
            // merge eventId into each session
            const sessionsWithId = sessions.map(session => ({ ...session, eventId })) 
            
            // save sessions to IndexedDB
            await sessionStore.saveSessions(sessionsWithId)

            // send event with session details for other components to consume
            this.dispatchEvent(new CustomEvent('sessionsLoaded', {
                bubbles: true,
                composed: true,
                detail: { sessions: sessionsWithId },
            }))

            // update status for UI
            this.#setStatus('loaded', `sessions ready for "${eventId}"`)
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
