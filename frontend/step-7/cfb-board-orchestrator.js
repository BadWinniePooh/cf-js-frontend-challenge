import { EventTypes as CfbEventTypes } from './lib/events.js'

export class CfbBoardOrchestrator extends HTMLElement {

    connectedCallback() {
        this.addEventListener('scheduleLoaded', this.#onLoaderDone)
        this.addEventListener('sessionsLoaded', this.#onLoaderDone)
        this.addEventListener(CfbEventTypes.SESSION_UPDATED, this.#onSessionUpdated)
    }

    disconnectedCallback() {
        this.removeEventListener('scheduleLoaded', this.#onLoaderDone)
        this.removeEventListener('sessionsLoaded', this.#onLoaderDone)
        this.removeEventListener(CfbEventTypes.SESSION_UPDATED, this.#onSessionUpdated)
    }

    #onLoaderDone = (e) => {
        // TODO: When both loaders have succeeded, we can update the UI.
    }

    #onSessionUpdated = (e) => {
        // TODO: when session is updated, we need to update the UI.

        // Now the backend has updated a session, we need to refresh the UI.
        // And that should make the UI to fetch the latest session data - now for simplicity could
        // retrieve all the sessions through cfb-session-loader.
        // To do that, use the familiar pattern of triggering an action in a child component
    }
}
