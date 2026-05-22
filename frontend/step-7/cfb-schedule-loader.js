import createScheduleStore from './lib/store/schedule-store.js'
import { getBackendApi } from './lib/api/backend-api.js'

const scheduleStore = createScheduleStore()

export class CfbScheduleLoader extends HTMLElement {
  static get observedAttributes() {
    return ['data-event-id']
  }

  connectedCallback() {
    this.#setStatus('initialized', `fetching schedule for "${this.dataset.eventId}"…`)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-event-id' && newValue && newValue !== oldValue) {
      this.#load(newValue)
    }
  }

  async #load(eventId) {
    this.#setStatus('loading', `fetching schedule for "${eventId}"…`)

    try {
      // read schedule from backend API
      const schedule = await getBackendApi().getSchedule(eventId)

      // merge eventId into schedule
      const scheduleWithId = { ...schedule, eventId }

      // save schedule to IndexedDB
      await scheduleStore.saveSchedule(scheduleWithId)

      // send event with schedule details for other components to consume
      this.dispatchEvent(new CustomEvent('scheduleLoaded', {
        bubbles: true,
        composed: true,
        detail: { schedule: scheduleWithId },
      }))

      // update status for UI
      this.#setStatus('loaded', `schedule ready for "${eventId}"`)

    } catch (err) {
      this.#setStatus('error', `failed: ${err.message}`)

      this.dispatchEvent(new CustomEvent('loaderError', {
        bubbles: true,
        composed: true,
        detail: { loader: 'schedule', eventId, error: err.message },
      }))
    }
  }

  #setStatus(state, message) {
    // small helper method for UI to see what's happening
    this.dataset.state = state
    this.textContent = `[schedule-loader] ${message}`
  }
}
