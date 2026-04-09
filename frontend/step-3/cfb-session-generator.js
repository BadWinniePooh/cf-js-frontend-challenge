import { cfbSessionCreated, cfbSessionRemoved } from './events.js'
import { generateRandomSession } from './lib/generate-random-session.js'
import { getAllSessions, saveSessions } from '../step-4/session-store.js'

export class CfbSessionGenerator extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <button class="cfb-session-generator__btn">
                + Add random session
            </button>
            <button class="cfb-session-clear__btn">
                - Clear All Sessions
            </button>
        `;
    this.querySelector(".cfb-session-generator__btn").addEventListener(
      "click",
      this.#onClick,
    );
    this.querySelector(".cfb-session-clear__btn").addEventListener(
      "click",
      this.#onClear,
    );
  }

  disconnectedCallback() {
    // TODO: Remove event listener here for #onClick
  }

  #onClear = async () => {
    let sessions = await getAllSessions();
    sessions.forEach(session => {
        this.dispatchEvent(cfbSessionRemoved(session.id))
    });
  };

  #onClick = () => {
    // ✨: You should send the session 'up the DOM' by dispatching a custom event.
    const session = generateRandomSession()
    this.dispatchEvent(cfbSessionCreated(session))
  }
}
