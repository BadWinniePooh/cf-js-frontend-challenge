import { EventTypes as CfbEventTypes } from './lib/events.js'

export class CfbBoardOrchestrator extends HTMLElement {

    #loaded = new Set()

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
        this.#loaded.add(e.type)

        if (this.#loaded.has('scheduleLoaded') && this.#loaded.has('sessionsLoaded')) {
            this.#loaded.clear()
            const ts = Date.now().toString()
            this.querySelectorAll('.listens-schedule-updates').forEach(el => {
                el.dataset.latestUpdatedAt = ts
            })
        }
    }

    #onSessionUpdated = (e) => {
        const ts = Date.now().toString()
        this.querySelectorAll('.listens-session-reloads').forEach(el => {
            el.dataset.reloadToken = ts
        })
    }
}
