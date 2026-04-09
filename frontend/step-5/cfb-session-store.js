import { EventTypes, cfbSessionsLoadedToIDB } from './events.js'
import { saveSessions, deleteSession, getAllSessions, updateSession } from '../step-4/session-store.js'

// Step 5 variant: same as Step 4, plus explicit handling of SESSION_UPDATED
// (edit flow) alongside SESSION_CREATED (add flow).
//
// Both mutation handlers end in saveSessions + sessionsLoaded — the
// orchestrator still only listens for sessionsLoaded.
export class CfbSessionStore extends HTMLElement {
    connectedCallback() {
        this.addEventListener(EventTypes.SESSION_CREATED,  this.#onSessionCreated)
        this.addEventListener(EventTypes.SESSION_UPDATED,  this.#onSessionUpdated)
        this.addEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    disconnectedCallback() {
        this.removeEventListener(EventTypes.SESSION_CREATED,  this.#onSessionCreated)
        this.removeEventListener(EventTypes.SESSION_UPDATED,  this.#onSessionUpdated)
        this.removeEventListener(EventTypes.SESSION_REMOVED, this.#onSessionRemoved)
    }

    #onSessionCreated = async e => {
        await saveSessions([e.detail])
        await this.#broadcastSessions()
    }

    #onSessionUpdated = async e => {
        await updateSession(e.detail)
        await this.#broadcastSessions()
    }

    #onSessionRemoved = async e => {
        await deleteSession(e.detail.sessionId)
        await this.#broadcastSessions()
    }

    async #broadcastSessions() {
        const sessions = await getAllSessions()
        this.dispatchEvent(cfbSessionsLoadedToIDB())
    }
}
