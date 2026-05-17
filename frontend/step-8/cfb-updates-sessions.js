import { EventTypes } from './lib/events.js'
import { getBackendApi } from './lib/api/backend-api.js'

export class CfbUpdatesSessions extends HTMLElement {
    connectedCallback() {
        this.addEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
        this.addEventListener(EventTypes.SESSION_UPDATED, this.#onSessionUpdated)
        this.addEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    disconnectedCallback() {
        this.removeEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
        this.removeEventListener(EventTypes.SESSION_UPDATED, this.#onSessionUpdated)
        this.removeEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    #onSessionCreated = async (e) => {
        const eventId = this.dataset.eventId
        if (!eventId) return
        e.stopPropagation()

        const session = e.detail
        await this.#putSession(eventId, session.id, session)
        this.#notifySaved(eventId)
    }

    #onSessionUpdated = async (e) => {
        const eventId = this.dataset.eventId
        if (!eventId) return
        e.stopPropagation()

        const session = e.detail
        await this.#patchSession(eventId, session.id, session)
        this.#notifySaved(eventId)
    }

    #onSessionRemoved = async (e) => {
        const eventId = this.dataset.eventId
        if (!eventId) return
        e.stopPropagation()

        const { sessionId } = e.detail
        await getBackendApi().deleteSession(eventId, sessionId)
        this.#notifySaved(eventId)
    }

    async #putSession(eventId, sessionId, payload) {
        await getBackendApi().putSession(eventId, sessionId, payload)
    }

    async #patchSession(eventId, sessionId, payload) {
        await getBackendApi().patchSession(eventId, sessionId, payload)
    }

    #notifySaved(eventId) {
        this.dispatchEvent(new CustomEvent('sessionsBackendUpdated', {
            bubbles: true,
            composed: true,
            detail: { eventId, updatedAt: Date.now() },
        }))
    }
}
