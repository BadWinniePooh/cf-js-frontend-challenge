import { sessionDetails } from "../step-2/lib/builds-session-details.js";
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
    this.#cancelBtn().addEventListener("click", this.#onCancel);
    this.#saveBtn().addEventListener("click", this.#onSubmit);
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    // ✨ remove event listeners here
    this.#cancelBtn().removeEventListener("click", this.#onCancel);
    this.#saveBtn().removeEventListener("click", this.#onSubmit);
  }

  // Called by cfb-session-card before it triggers the flip.
  populate(session) {
    // ✨ This can be a way to add session information to the form.
    this.#session = session;
    this.querySelector('[name="title"]').value = session.title;
    //this.querySelector('[name="speakers"]').value = session.attendees.map(a => a.name).join(', ')
    //this.querySelector('[name="tags"]').value = session.tags.map(t => t.label).join(', ')
    // [ Code here ]
  }

  // Called by cfb-session-card after the flip-back completes.
  reset() {
    this.querySelector("form")?.reset();
    // ✨ Reset all the details here
    // [ Code here ]
  }

  // ── DOM helpers ───────────────────────────────────────────────

  #saveBtn = () => this.querySelector(".cfb-edit-form__save");
  #cancelBtn = () => this.querySelector(".cfb-edit-form__cancel");

  // ── Submit / cancel ───────────────────────────────────────────

  #onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const form = this.querySelector("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const event = cfbSessionUpdated(
        sessionDetails({
            id: this.#session.id,
            title: data.get("title"),
            day: this.#session.day,
            room: this.#session.room,
            sessionType: this.#session.sessionType,
            tags: this.#session.tags,
            attendees: this.#session.attendees,
        })
    )

    
    this.dispatchEvent(event);
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
                    <div class="cfb-edit-session-form__field">
                        <label for="cfb-edit-title" class="cfb-edit-session-form__label">Title</label>
                        <input id="cfb-edit-title" class="cfb-edit-session-form__input"
                            name="title" type="text" required minlength="5" />
                    </div>
                </div>

                <footer class="cfb-edit-form__actions">
                    <button type="button" class="cfb-edit-form__cancel">Cancel</button>
                    <button type="submit" class="cfb-edit-form__save">Save changes</button>
                </footer>
            </form>
        `;
  }
}
