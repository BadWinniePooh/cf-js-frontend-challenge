import { cfbSessionUpdated } from "./events.js";
import { isKnownTag, labelToColor } from "./lib/label-to-color.js";

function parseSpeaker(raw) {
  const name = raw.trim();
  if (!name) return [];
  const initials = name
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return [{ initials, name }];
}

export class CfbEditSessionForm extends HTMLElement {
  static elementName = "cfb-edit-session-form";

  #session = null;

  connectedCallback() {
    this.#render();
    this.addEventListener("submit", this.#onSubmit);
    // ✨ Add event listeners here
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    // ✨ remove event listeners here
  }

  // Called by cfb-session-card before it triggers the flip.
  populate(session) {
    // ✨ This can be a way to add session information to the form.
    // [ Code here ]
  }

  // Called by cfb-session-card after the flip-back completes.
  reset() {
    this.querySelector("form")?.reset();
    // ✨ Reset all the details here
    // [ Code here ]
  }

  // ── DOM helpers ───────────────────────────────────────────────

  // ── Submit / cancel ───────────────────────────────────────────

  #onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const form = this.querySelector("form");
    // ✨ make use of FormData, check validity, etc.
    // [ Code here ]
    // Important: don't forget to dispatch the session updated event!'
  };

  #onCancel = () => {
    // ✅ Because of the 'flip', a cancel event must be dispatched so the card can flip back.
    this.dispatchEvent(
      new CustomEvent("cfb-edit-cancelled", { bubbles: true }),
    );
  };

  // ── Template ──────────────────────────────────────────────────

  #render() {
    this.innerHTML = `
            <form class="cfb-edit-form">
                <header class="cfb-edit-form__header">
                    <h3 class="cfb-edit-form__title">Edit Session</h3>
                </header>

                <div class="cfb-edit-form__body">
                    <p>Add edit form here</p>
                </div>

                <footer class="cfb-edit-form__actions">
                    <button type="button" class="cfb-edit-form__cancel">Cancel</button>
                    <button type="submit" class="cfb-edit-form__save">Save changes</button>
                </footer>
            </form>
        `;
  }
}
