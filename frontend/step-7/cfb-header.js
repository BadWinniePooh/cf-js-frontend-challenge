import createScheduleStore from './lib/store/schedule-store.js'

const scheduleStore = createScheduleStore()

export class CfbHeader extends HTMLElement {
    static elementName = 'cfb-header'

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
        if (!schedule) {
            this.#renderPlaceholder('Waiting for conference details…')
            return
        }

        this.innerHTML = `
            <header class="cfb-schedule__header">
                <h2>${schedule.name}</h2>
                <p>${schedule.location} &mdash; ${schedule.date}</p>
            </header>
        `
    }

    #renderPlaceholder(message = 'Waiting for conference details…') {
        this.innerHTML = `<p class="cfb-schedule__placeholder">${message}</p>`
    }
}
