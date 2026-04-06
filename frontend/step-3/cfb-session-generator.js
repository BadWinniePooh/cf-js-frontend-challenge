import { cfbSessionCreated } from './events.js'
import { generateRandomSession } from './lib/generate-random-session.js'

export class CfbSessionGenerator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <button class="cfb-session-generator__btn">
                + Add random session
            </button>
        `
    // TODO: Add event listener here for #onClick
  }

  disconnectedCallback() {
    // TODO: Remove event listener here for #onClick
  }

  #onClick = () => {
    // ✨: You should send the session 'up the DOM' by dispatching a custom event.
    const session = generateRandomSession()
  }
}
