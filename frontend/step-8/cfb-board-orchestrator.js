export class CfbBoardOrchestrator extends HTMLElement {
  /** @type {Set<string>} */
  #loaded = new Set()
  #currentEventId = null

  connectedCallback() {
    this.addEventListener('scheduleLoaded', this.#onLoaderDone)
    this.addEventListener('sessionsLoaded', this.#onLoaderDone)
    this.addEventListener('sessionsBackendUpdated', this.#onSessionsBackendUpdated)
  }

  disconnectedCallback() {
    this.removeEventListener('scheduleLoaded', this.#onLoaderDone)
    this.removeEventListener('sessionsLoaded', this.#onLoaderDone)
    this.removeEventListener('sessionsBackendUpdated', this.#onSessionsBackendUpdated)
  }

  #onLoaderDone = (e) => {
    const { eventId, updatedAt } = e.detail

    this.#notifyEventListeners(eventId)

    if (eventId !== this.#currentEventId) {
      this.#loaded.clear()
      this.#currentEventId = eventId
    }

    this.#loaded.add(e.type)

    if (this.#loaded.has('scheduleLoaded') && this.#loaded.has('sessionsLoaded')) {
      this.#notifyScheduleOnly(eventId, updatedAt)
      this.#loaded.clear()
      return
    }

    if (e.type === 'sessionsLoaded' && this.#currentEventId === eventId) {
      this.#notifyScheduleOnly(eventId, updatedAt)
    }
  }

  #notifyEventListeners(eventId) {
    this.querySelectorAll('.listens-event-changes').forEach((el) => {
      el.dataset.eventId = eventId
    })
  }

  #onSessionsBackendUpdated = (e) => {
    const { eventId, updatedAt } = e.detail
    this.#notifySessionReloaders(eventId, updatedAt)
    this.#currentEventId = eventId
    this.#loaded.add('scheduleLoaded')
  }

  #notifySessionReloaders(eventId, updatedAt) {
    this.querySelectorAll('.listens-session-reloads').forEach((el) => {
      el.dataset.eventId = eventId
      el.setAttribute('data-reload-token', String(updatedAt))
    })
  }

  #notifyScheduleOnly(eventId, updatedAt) {
    this.querySelectorAll('.listens-schedule-updates').forEach((el) => {
      el.dataset.eventId = eventId
      el.setAttribute('data-latest-updated-at', String(updatedAt))
    })
  }
}
