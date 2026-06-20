import createScheduleStore from '../step-7/lib/store/schedule-store.js'
import { getBackendApi } from './lib/api/backend-api.js'

const scheduleStore = createScheduleStore()

export class CfbScheduleLoader extends HTMLElement {
  static get observedAttributes() {
    return ['data-event-id']
  }

  connectedCallback() {
    const eventId = this.dataset.eventId
    if (eventId) this.#load(eventId)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-event-id' && newValue && newValue !== oldValue) {
      this.#load(newValue)
    }
  }

  async #load(eventId) {
    this.#setStatus('loading', `fetching schedule for "${eventId}"…`)

    try {
      const schedule = await getBackendApi().getSchedule(eventId)
      await scheduleStore.saveSchedule(schedule)
      this.#setStatus('done', `schedule ready - ${schedule.name}`)

      this.dispatchEvent(
        new CustomEvent('scheduleLoaded', {
          bubbles: true,
          composed: true,
          detail: { eventId, updatedAt: Date.now() },
        })
      )
    } catch (err) {
      this.#setStatus('error', `failed: ${err.message}`)

      this.dispatchEvent(
        new CustomEvent('loaderError', {
          bubbles: true,
          composed: true,
          detail: { loader: 'schedule', eventId, error: err.message },
        })
      )
    }
  }

  #setStatus(state, message) {
    this.dataset.state = state
    this.textContent = `[schedule-loader] ${message}`
  }
}
