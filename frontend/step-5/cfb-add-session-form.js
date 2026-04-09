import { cfbSessionCreated } from "./events.js";
import { sessionDetails } from "../step-2/lib/builds-session-details.js";
import { isKnownTag, KNOWN_TAGS, labelToColor } from "./lib/label-to-color.js";

function parseSpeaker(raw) {
  const name = raw.trim();
  if (!name) return [];
  const initials = name
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return [{ initials, name }];
}

export class CfbAddSessionForm extends HTMLElement {
  static elementName = "cfb-add-session-form";

  #tags = [];

  connectedCallback() {
    this.#render();
    this.addEventListener("submit", this.#onSubmit);
    this.#trigger().addEventListener("click", this.#onTriggerClick);
    this.#dialog().addEventListener("click", this.#onBackdropClick); // closes the dialog when clicking outside
    this.#dialog().addEventListener("close", this.#onDialogClose); // empties the form when closed
    // ✨ Add event listeners here,
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    this.#trigger().removeEventListener("click", this.#onTriggerClick);
    this.#dialog().removeEventListener("click", this.#onBackdropClick);
    this.#dialog().removeEventListener("close", this.#onDialogClose);
    // ✨ Remove event listeners here,
  }
  // ── DOM helpers ───────────────────────────────────────────────

  #dialog = () => this.querySelector("dialog");
  #trigger = () => this.querySelector(".cfb-add-session-form__trigger");

  // ── Dialog open / close ───────────────────────────────────────

  #onTriggerClick = () => this.#dialog().showModal();

  #onBackdropClick = (evt) => {
    // closes the dialog when clicking outside
    if (evt.target === this.#dialog()) this.#dialog().close();
  };

  #onClose = () => this.#dialog().close();

  #onDialogClose = () => {
    // ✨ empty the form
    // [ Code here ]
  };

  // ── Form submit ───────────────────────────────────────────────

  #onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const form = this.querySelector("form");
    // ✨ make use of FormData, check validity, etc.
    // [ Code here ]
  };

  #render() {
    this.innerHTML = `
            <button class="cfb-add-session-form__trigger" aria-haspopup="dialog">
                + Add Session
            </button>
            <dialog class="cfb-add-session-form__dialog" aria-label="Add a new session">
                <div class="cfb-add-session-form__card">
                    
                    <p>Add Form here</p>
                </div>
            </dialog>   
        `;
  }
}
