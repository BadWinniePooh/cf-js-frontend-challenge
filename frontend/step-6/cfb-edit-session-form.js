import { sessionDetails } from "../step-2/lib/builds-session-details.js";
import { cfbSessionUpdated } from "../step-5/events.js";
import { labelToColor } from "../step-5/lib/label-to-color.js";
import { parseSpeakers, speakersToString } from "../step-5/lib/speaker.js";
import { TagChipController } from "../step-5/lib/tag-chips.js";
import { sessionFormFields } from "./lib/session-form-fields.js";

export class CfbEditSessionForm extends HTMLElement {
  static elementName = "cfb-edit-session-form";

  #session = null;
  #tagCtrl = new TagChipController(this);

  connectedCallback() {
    this.#render();
    this.addEventListener("submit", this.#onSubmit);
    this.#cancelBtn().addEventListener("click", this.#onCancel);
    this.#tagCtrl.bind();
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    this.#cancelBtn().removeEventListener("click", this.#onCancel);
    this.#tagCtrl.unbind();
  }

  // Called by cfb-session-card before it triggers the flip.
  populate(session) {
    this.#session = session;
    this.#tagCtrl.setTags(session.tags.map((t) => t.label));

    this.querySelector('[name="title"]').value = session.title;
    this.querySelector('[name="day"]').value = session.day ?? "";
    this.querySelector('[name="room"]').value = session.room ?? "";

    this.querySelectorAll('cfb-session-type[name="session-type"]')
      .forEach(el => { el.checked = el.getAttribute('value') === session.sessionType; });

    this.querySelector('[name="speaker"]').value = speakersToString(session.attendees);
  }

  // Called by cfb-session-card after the flip-back completes.
  reset() {
    this.querySelector("form")?.reset();
    this.#session = null;
    this.#tagCtrl.reset();
  }

  // ── DOM helpers ───────────────────────────────────────────────

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
    const speaker = data.get("speaker")?.trim() ?? "";
    const attendees = speaker ? parseSpeakers(speaker) : this.#session.attendees;

    const event = cfbSessionUpdated(
      sessionDetails({
        id: this.#session.id,
        title: data.get("title"),
        day: data.get("day"),
        room: data.get("room"),
        sessionType: data.get("session-type"),
        tags: this.#tagCtrl.tags.map((label) => ({ label, color: labelToColor(label) })),
        attendees,
      })
    );

    this.dispatchEvent(event);
  };

  #onCancel = () => {
    this.dispatchEvent(new CustomEvent("cfb-edit-cancelled", { bubbles: true }));
  };

  // ── Template ──────────────────────────────────────────────────

  #render() {
    this.innerHTML = `
      <form class="cfb-edit-form">
        <header class="cfb-edit-form__header">
          <h3 class="cfb-edit-form__title">Edit Session</h3>
        </header>

        <div class="cfb-edit-form__body">
          ${sessionFormFields('cfb-edit', 'cfb-edit-session-form')}
        </div>

        <footer class="cfb-edit-form__actions">
          <button type="button" class="cfb-edit-form__cancel">Cancel</button>
          <button type="submit" class="cfb-edit-form__save">Save changes</button>
        </footer>
      </form>
    `;
  }
}
