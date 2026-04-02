// The change from step 3:
//   - The orchestrator no longer has inner state - it only listens to events and passes them on.
export class CfbBoardOrchestrator extends HTMLElement {

  connectedCallback() {
    this.addEventListener('sessionsLoaded', this.#onSessionsLoaded)
  }

  disconnectedCallback() {
    this.removeEventListener('sessionsLoaded', this.#onSessionsLoaded)
  }

  #onSessionsLoaded(e) {
    this.querySelectorAll('.cfb-updates-schedule').forEach(schedule => {
      schedule.setAttribute('data-sessions', JSON.stringify(e.detail.sessions))
    })
  }
}
