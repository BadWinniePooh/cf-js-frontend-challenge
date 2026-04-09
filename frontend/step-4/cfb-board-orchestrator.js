// The change from step 3:
// ✨ - The orchestrator no longer has inner state - it only listens to events and passes them on.
import { EventTypes } from './events.js'

export class CfbBoardOrchestrator extends HTMLElement {
  // 🔥: remove this
  #sessions = []

  connectedCallback() {
    // 🔥: We want to remove this behavior ... and
    this.addEventListener(EventTypes.SESSION_CREATED, this.#addSession)
    this.addEventListener(EventTypes.SESSION_LOADED_TO_IDB, this.#loadSessions)
    this.#updateChildren()
    // ✨ instead let the children to read directly from IndexedDB by updating 'data-latest-updated-at'
  }

  disconnectedCallback() {
    // 🔥: We want to remove this behavior ... and
    this.removeEventListener(EventTypes.SESSION_CREATED, this.#addSession)
    this.removeEventListener(EventTypes.SESSION_LOADED_TO_IDB, this.#loadSessions)
  }

  #loadSessions(evt) {
    if (evt.detail._type !== EventTypes.SESSION_LOADED_TO_IDB) return

    this.#sessions = [evt.detail]
    this.#updateChildren();
  }

  // 🔥: burn this
  #addSession(evt) {
    if (evt.detail._type !== EventTypes.SESSION_CREATED) return
    
    this.#sessions = [...this.#sessions, evt.detail]
    this.#updateChildren()
  }

  // 🔥: burn this
  #updateChildren() {
    this.querySelectorAll('[listens-schedule-update]').forEach(listener => {
      const tagName = listener.tagName.toLowerCase();
      const schedule = this.querySelector(tagName);

      schedule.setAttribute('data-sessions', JSON.stringify(this.#sessions))
      schedule.setAttribute('data-latest-updated-at', Date.now())
    })
  }

}
