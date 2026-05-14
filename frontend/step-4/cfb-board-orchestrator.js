// The change from step 3:
// ✨ - The orchestrator no longer has inner state - it only listens to events and passes them on.
import { EventTypes } from './lib/events.js'

export class CfbBoardOrchestrator extends HTMLElement {

  connectedCallback() {
    this.addEventListener(EventTypes.SESSION_LOADED_TO_IDB, this.#onSessionsLoaded)
  }

  disconnectedCallback() {
    this.removeEventListener(EventTypes.SESSION_LOADED_TO_IDB, this.#onSessionsLoaded)
  }

  #onSessionsLoaded(e) {
    // 🚧 Instead of passing the data around, we just inform the elements that they need to update.
    // ✨ Here: you should update the data-latest-updated-at attribute on all cfb-updates-schedule elements.
    const now = Date.now()
    this.querySelectorAll('.listens-schedule-updates').forEach(schedule => {
      schedule.setAttribute('data-latest-updated-at', now)
    })
  }
}
