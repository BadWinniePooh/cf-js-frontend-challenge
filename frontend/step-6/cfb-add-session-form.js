import { cfbSessionCreated } from "../step-5/events.js";
import { sessionDetails } from "../step-2/lib/builds-session-details.js";
import { labelToColor } from "../step-5/lib/label-to-color.js";
import { parseSpeakers } from "../step-5/lib/speaker.js";
import { TagChipController } from "../step-5/lib/tag-chips.js";
import { sessionFormFields } from "./lib/session-form-fields.js";

export class CfbAddSessionForm extends HTMLElement {
  static elementName = "cfb-add-session-form";

  #tagCtrl = new TagChipController(this);

  connectedCallback() {
    this.#render();
    this.addEventListener("submit", this.#onSubmit);
    this.#trigger().addEventListener("click", this.#onTriggerClick);
    this.#dialog().addEventListener("click", this.#onBackdropClick);
    this.#dialog().addEventListener("close", this.#onDialogClose);
    this.#cancelBtn().addEventListener("click", this.#onClose);
    this.#tagCtrl.bind();
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    this.#trigger().removeEventListener("click", this.#onTriggerClick);
    this.#dialog().removeEventListener("click", this.#onBackdropClick);
    this.#dialog().removeEventListener("close", this.#onDialogClose);
    this.#cancelBtn().removeEventListener("click", this.#onClose);
    this.#tagCtrl.unbind();
  }

  // ── DOM helpers ───────────────────────────────────────────────

  #dialog    = () => this.querySelector("dialog");
  #trigger   = () => this.querySelector(".cfb-add-session-form__trigger");
  #cancelBtn = () => this.querySelector(".cfb-add-session-form__cancel");

  // ── Dialog open / close ───────────────────────────────────────

  #onTriggerClick = () => this.#dialog().showModal();

  #onBackdropClick = (evt) => {
    if (evt.target === this.#dialog()) this.#dialog().close();
  };

  #onClose = () => this.#dialog().close();

  #onDialogClose = () => {
    this.querySelector("form")?.reset();
    this.#tagCtrl.reset();
  };

  // ── Form submit ───────────────────────────────────────────────

  #onSubmit = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const form = this.querySelector("form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const event = cfbSessionCreated(
      sessionDetails({
        id: crypto.randomUUID(),
        title: data.get("title"),
        day: data.get("day"),
        room: data.get("room"),
        sessionType: data.get("session-type"),
        tags: this.#tagCtrl.tags.map((label) => ({ label, color: labelToColor(label) })),
        attendees: parseSpeakers(data.get("speaker") ?? ""),
      })
    );

    this.dispatchEvent(event);
    this.#dialog().close();
  };

  #render() {
    this.innerHTML = `
      <button class="cfb-add-session-form__trigger" aria-haspopup="dialog">
        + Add Session
      </button>
      <dialog class="cfb-add-session-form__dialog" aria-label="Add a new session">
        <div class="cfb-add-session-form__card">
          <form class="cfb-add-session-form__form">
            <h2 class="cfb-add-session-form__heading">Add a new session</h2>

            ${sessionFormFields('cfb-add', 'cfb-add-session-form')}

            <div class="cfb-add-session-form__actions">
              <button type="button" class="cfb-add-session-form__cancel">Cancel</button>
              <button type="submit" class="cfb-add-session-form__submit">Add Session</button>
            </div>
          </form>
        </div>
      </dialog>
    `;
  }
}
