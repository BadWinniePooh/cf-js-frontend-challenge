import createScheduleStore from '../step-7/lib/store/schedule-store.js'

const scheduleStore = createScheduleStore()

export class CfbHeader extends HTMLElement {
  static get observedAttributes() {
    return ['data-event-id']
  }

  connectedCallback() {
    if (this.dataset.eventId) {
      this.#render()
      return
    }
    this.#renderPlaceholder()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'data-event-id' || oldValue === newValue) {
      return
    }
    this.#render()
  }

  async #render() {
    const eventId = this.dataset.eventId
    if (!eventId) {
      this.#renderPlaceholder()
      return
    }

    const schedule = await scheduleStore.getSchedule(eventId)
    let headerPart = this.querySelector('[data-schedule-header]')

    if (!headerPart) {
      headerPart = document.createElement('header')
      headerPart.className = 'cfb-schedule__header'
      headerPart.dataset.scheduleHeader = ''
      this.prepend(headerPart)
    }

    if (!schedule) {
      headerPart.innerHTML = `<p class="cfb-schedule__placeholder">Waiting for conference details…</p>`
      return
    }

    headerPart.innerHTML = `
            <h2>${schedule.name}</h2>
            <p>${schedule.location} &mdash; ${schedule.date}</p>
        `
  }

  #renderPlaceholder(message = 'Waiting for conference details…') {
    let headerPart = this.querySelector('[data-schedule-header]')
    if (!headerPart) {
      headerPart = document.createElement('header')
      headerPart.className = 'cfb-schedule__header'
      headerPart.dataset.scheduleHeader = ''
      this.prepend(headerPart)
    }
    headerPart.innerHTML = `<p class="cfb-schedule__placeholder">${message}</p>`
  }
}
