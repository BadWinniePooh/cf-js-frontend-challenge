import { sessionDetails } from "../step-2/lib/builds-session-details.js";
import { cfbSessionUpdated } from "./events.js";
import { KNOWN_TAGS, labelToColor } from "./lib/label-to-color.js";
import {parseSpeakers, speakersToString} from "./lib/speaker.js"

export class CfbEditSessionForm extends HTMLElement {
  static elementName = "cfb-edit-session-form";

  #session = null;
  #tags = [];

  connectedCallback() {
    this.#render();
    this.addEventListener("submit", this.#onSubmit);
    this.#cancelBtn().addEventListener("click", this.#onCancel);
    this.#addTagBtn().addEventListener("click", this.#onAddTag);
    this.#tagInput().addEventListener("keydown", this.#onTagKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    this.#cancelBtn().removeEventListener("click", this.#onCancel);
    this.#addTagBtn().removeEventListener("click", this.#onAddTag);
    this.#tagInput().removeEventListener("keydown", this.#onTagKeydown);
  }

  // Called by cfb-session-card before it triggers the flip.
  populate(session) {
    this.#session = session;
    this.#tags = session.tags.map((t) => t.label);

    this.querySelector('[name="title"]').value = session.title;
    this.querySelector('[name="day"]').value = session.day ?? "";
    this.querySelector('[name="room"]').value = session.room ?? "";

    const radios = this.querySelectorAll('[name="sessionType"]');
    radios.forEach((r) => { r.checked = r.value === session.sessionType; });

    this.querySelector('[name="speaker"]').value = speakersToString(session.attendees)
    this.#updateTagChips();
  }

  // Called by cfb-session-card after the flip-back completes.
  reset() {
    this.querySelector("form")?.reset();
    this.#session = null;
    this.#tags = [];
    this.#updateTagChips();
  }

  // ── DOM helpers ───────────────────────────────────────────────

  #cancelBtn  = () => this.querySelector(".cfb-edit-form__cancel");
  #addTagBtn  = () => this.querySelector(".cfb-edit-form__add-tag-btn");
  #tagInput   = () => this.querySelector(".cfb-edit-form__tag-input");
  #tagChips   = () => this.querySelector(".cfb-edit-form__tag-chips");
  #tagsHidden = () => this.querySelector('input[name="tags"]');

  // ── Tag management ────────────────────────────────────────────

  #onAddTag = () => {
    const input = this.#tagInput();
    const label = input.value.trim();
    if (!label || this.#tags.includes(label)) { input.value = ""; return; }
    this.#tags.push(label);
    input.value = "";
    this.#updateTagChips();
  };

  #onTagKeydown = (evt) => {
    if (evt.key === "Enter") { evt.preventDefault(); this.#onAddTag(); }
  };

  #updateTagChips() {
    const chips = this.#tagChips();
    if (!chips) return;
    chips.innerHTML = this.#tags
      .map((tag) => `
        <span class="cfb-edit-form__chip" data-tag="${tag}">
          ${tag}
          <button type="button" class="cfb-edit-form__chip-remove" aria-label="Remove ${tag}">×</button>
        </span>`)
      .join("");
    chips.querySelectorAll(".cfb-edit-form__chip-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.closest("[data-tag]").dataset.tag;
        this.#tags = this.#tags.filter((t) => t !== tag);
        this.#updateTagChips();
      });
    });
    this.#tagsHidden().value = this.#tags.join(",");
  }

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
    
    const speakers = parseSpeakers(data.get("speaker")?.trim() ?? "")

    const attendees = speakers ? speakers : this.#session.attendees;

    const event = cfbSessionUpdated(
      sessionDetails({
        id: this.#session.id,
        title: data.get("title"),
        day: data.get("day"),
        room: data.get("room"),
        sessionType: data.get("sessionType"),
        tags: this.#tags.map((label) => ({ label, color: labelToColor(label) })),
        attendees,
      })
    );

    console.log(event);

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
          <div class="cfb-edit-session-form__field">
            <label for="cfb-edit-title" class="cfb-edit-session-form__label">Title</label>
            <input id="cfb-edit-title" class="cfb-edit-session-form__input"
              name="title" type="text" required minlength="5" />
          </div>

          <div class="cfb-edit-session-form__field">
            <label for="cfb-edit-day" class="cfb-edit-session-form__label">Day</label>
            <select id="cfb-edit-day" class="cfb-edit-session-form__select" name="day" required>
              <option value="">Select a day…</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          <div class="cfb-edit-session-form__field">
            <label for="cfb-edit-room" class="cfb-edit-session-form__label">Room</label>
            <input id="cfb-edit-room" class="cfb-edit-session-form__input"
              name="room" type="text" list="cfb-edit-room-list" required autocomplete="off" />
            <datalist id="cfb-edit-room-list">
              <option value="Main Hall"></option>
              <option value="Track A"></option>
              <option value="Track B"></option>
              <option value="Workshop Room"></option>
            </datalist>
          </div>

          <fieldset class="cfb-edit-session-form__fieldset">
            <legend class="cfb-edit-session-form__legend">Session type</legend>
            <label class="cfb-edit-session-form__radio-label">
              <input type="radio" name="sessionType" value="Talk" required /> Talk
            </label>
            <label class="cfb-edit-session-form__radio-label">
              <input type="radio" name="sessionType" value="Workshop" /> Workshop
            </label>
            <label class="cfb-edit-session-form__radio-label">
              <input type="radio" name="sessionType" value="Keynote" /> Keynote
            </label>
            <label class="cfb-edit-session-form__radio-label">
              <input type="radio" name="sessionType" value="Lightning Talk" /> Lightning Talk
            </label>
          </fieldset>

          <div class="cfb-edit-session-form__field">
            <label for="cfb-edit-tag-input" class="cfb-edit-session-form__label">
              Tags <span class="cfb-edit-session-form__optional">(optional)</span>
            </label>
            <div class="cfb-edit-session-form__tag-row">
              <input id="cfb-edit-tag-input" class="cfb-edit-session-form__input cfb-edit-form__tag-input"
                type="text" list="cfb-edit-tag-list" placeholder="Add a tag…" autocomplete="off" />
              <datalist id="cfb-edit-tag-list">
                ${KNOWN_TAGS.map((t) => `<option value="${t.label}"></option>`).join("")}
              </datalist>
              <button type="button" class="cfb-edit-form__add-tag-btn">Add</button>
            </div>
            <div class="cfb-edit-form__tag-chips"></div>
            <input type="hidden" name="tags" value="" />
          </div>

          <div class="cfb-edit-session-form__field">
            <label for="cfb-edit-speaker" class="cfb-edit-session-form__label">
              Speaker <span class="cfb-edit-session-form__optional">(optional)</span>
            </label>
            <input id="cfb-edit-speaker" class="cfb-edit-session-form__input" name="speaker" type="text" />
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
