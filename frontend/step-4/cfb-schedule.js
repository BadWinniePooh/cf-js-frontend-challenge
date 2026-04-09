import { getAllSessions } from './session-store.js'

export class CfbSchedule extends HTMLElement {
  // 🚧: Change this to not to listen to 'data-sessions' but 'data-latest-updated-at' instead.'
  #sessions = []

  static get observedAttributes() {
    // 🚧: instead of 'data-sessions' , observe the data attribute orchestrator uses to inform of 'new data available' 
    return ['data-latest-updated-at']
  }

  static definedAttributes = {
    latestUpdatedAt: 'data-latest-updated-at',
  }

  async connectedCallback() {
      this.#sessions = await getAllSessions()

    this.#render()
  }

 /* attributeChangedCallback(name, _old, newValue) {
    // 🔥: remove this if-statement
    if (name === 'data-sessions') {
      this.#sessions = JSON.parse(newValue ?? '[]')
      this.#render()
    }
    // ✨: instead - read `this.#sessions` from IndexedDB
  }*/

  async attributeChangedCallback(name, oldValue, newValue) {
    if(oldValue === newValue) return

    if (name === CfbSchedule.definedAttributes.latestUpdatedAt) {
      this.#sessions = await getAllSessions()
      this.#render()
    }
  }

  #render() {

    if (this.#sessions.length === 0) {
      this.#renderPlaceholder()
      return
    }

    const byDay = this.#groupByDay(this.#sessions)

    this.innerHTML = `
            <div class="cfb-board">
                ${Object.entries(byDay).map(([day, daySessions]) => `
                    <section class="cfb-column">
                        <h2 class="cfb-column__heading">${day}</h2>
                        <div class="cfb-column__cards">
                            ${daySessions.map((s) => this.#renderCard(s)).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>
        `
  }

  #renderCard(session) {
    const sessionJson = JSON.stringify(session)
    return `<cfb-session-card data-session-details='${sessionJson}'></cfb-session-card>`
  }

  #groupByDay(sessions) {
    const ORDER = ['Wednesday', 'Thursday', 'Friday']
    return sessions.reduce((acc, s) => {
      if (!acc[s.day]) acc[s.day] = []
      acc[s.day].push(s)
      return acc
    }, Object.fromEntries(
      [...new Set(sessions.map((s) => s.day))]
        .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b))
        .map((day) => [day, []])
    ))
  }

  #renderPlaceholder() {
    this.innerHTML = `
            <p class="cfb-schedule__placeholder">
                No sessions yet — click the button to add one.
            </p>
        `
  }
}
