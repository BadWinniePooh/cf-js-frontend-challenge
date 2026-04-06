// The change from step 3:
// ✨ - The orchestrator no longer has inner state - it only listens to events and passes them on.
import { EventTypes } from './events.js'

export class CfbBoardOrchestrator extends HTMLElement {
  // 🔥: remove this
  #sessions = [{
    'title': 'Opening Keynote',
    'day': 'Wednesday',
    'tags': [{ 'label': 'Keynote', 'color': 'blue' }],
    'attendees': [{ 'name': 'Aino Korhonen', 'initials': 'AK' }, { 'name': 'Jukka Leinonen', 'initials': 'JL' }]
  }]

  connectedCallback() {
    // 🔥: We want to remove this behavior ... and
    this.addEventListener(EventTypes.SESSION_CREATED, this.#addSession)
    this.#updateChildren()
    // ✨ instead let the children to read directly from IndexedDB by updating 'data-latest-updated-at'
  }

  disconnectedCallback() {
    // 🔥: We want to remove this behavior ... and
    this.removeEventListener(EventTypes.SESSION_CREATED, this.#addSession)
    // ✨ remove the other listener
  }

  // 🔥: burn this
  #addSession(evt) {
    if (evt.detail._type !== EventTypes.SESSION_CREATED) return
    this.#sessions = [...this.#sessions, evt.detail]
    this.#updateChildren()
  }

  // 🔥: burn this
  #updateChildren() {
    this.querySelectorAll('.cfb-updates-schedule').forEach(schedule => {
      schedule.setAttribute('data-sessions', JSON.stringify(this.#sessions))
    })
  }

}
