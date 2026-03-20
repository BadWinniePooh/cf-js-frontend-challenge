export class CfbSchedule extends HTMLElement {
    // This is an existing Molecule, so we're not going to change it.'
    // This requires one data attribute: 'data-sessions' that contains a JSON array of sessions.
    #sessions = []

    static get observedAttributes() {
        return ['data-sessions']
    }

    connectedCallback() {
        this.#render()
    }

    attributeChangedCallback(name, _old, newValue) {
        if (name === 'data-sessions') {
            this.#sessions = JSON.parse(newValue ?? '[]')
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
        console.log('here')
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
