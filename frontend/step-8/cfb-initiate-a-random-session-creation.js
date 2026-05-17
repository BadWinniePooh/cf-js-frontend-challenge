import { getBackendApi } from './lib/api/backend-api.js'

export class CfbInitiateARandomSessionCreation extends HTMLElement {
  static elementName = 'cfb-initiate-a-random-session-creation'

  connectedCallback() {
    if (this.querySelector('button')) return

    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = 'Add random session (via backend)'
    button.addEventListener('click', () => this.#postRandomSession())
    this.appendChild(button)
  }

  async #postRandomSession() {
    const eventId = this.dataset.eventId
    if (!eventId) return

    const button = this.querySelector('button')
    button.disabled = true

    try {
      await getBackendApi().postRandomSession(eventId)
    } catch (err) {
      console.error('Random session request failed:', err)
    } finally {
      button.disabled = false
    }
  }
}
