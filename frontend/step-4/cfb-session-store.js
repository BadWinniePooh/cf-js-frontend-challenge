import { EventTypes } from './events.js'
import { saveSessions, deleteSession, getAllSessions } from './session-store.js'

// Single responsibility: mediate all session mutations between the event
// pipeline and IndexedDB.
//
// Wraps both <cfb-session-generator> and <cfb-schedule> in the DOM so that
// both cfb-session-created (bubbling up from the generator) and
// cfb-session-removed (bubbling up from session cards inside the schedule)
// pass through this element before reaching the orchestrator.
//
// After each mutation it re-reads IDB and fires sessionsLoaded — the
// orchestrator only ever hears that single, uniform event.
export class CfbSessionStore extends HTMLElement {
    connectedCallback() {
        this.addEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
        this.addEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    disconnectedCallback() {
        this.removeEventListener(EventTypes.SESSION_CREATED, this.#onSessionCreated)
        this.removeEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    #onSessionCreated = async (e) => {
        await saveSessions([e.detail])
        await this.#broadcastSessions()
    }

    #onSessionRemoved = async (e) => {
        await deleteSession(e.detail.sessionId)
        await this.#broadcastSessions()
    }

    async #broadcastSessions() {
        const sessions = await getAllSessions()
        this.dispatchEvent(new CustomEvent('sessionsLoaded', {
            bubbles: true,
            detail: { sessions },
        }))
    }
}
