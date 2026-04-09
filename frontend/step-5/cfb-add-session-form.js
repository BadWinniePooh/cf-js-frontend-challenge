import { cfbSessionCreated } from "./events.js";
import { sessionDetails } from "../step-2/lib/builds-session-details.js";
import { KNOWN_TAGS, labelToColor } from "./lib/label-to-color.js";

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
    this.#dialog().addEventListener("click", this.#onBackdropClick);
    this.#dialog().addEventListener("close", this.#onDialogClose);
    this.#cancelBtn().addEventListener("click", this.#onClose);
    this.#addTagBtn().addEventListener("click", this.#onAddTag);
    this.#tagInput().addEventListener("keydown", this.#onTagKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("submit", this.#onSubmit);
    this.#trigger().removeEventListener("click", this.#onTriggerClick);
    this.#dialog().removeEventListener("click", this.#onBackdropClick);
    this.#dialog().removeEventListener("close", this.#onDialogClose);
    this.#cancelBtn().removeEventListener("click", this.#onClose);
    this.#addTagBtn().removeEventListener("click", this.#onAddTag);
    this.#tagInput().removeEventListener("keydown", this.#onTagKeydown);
  }

  // ── DOM helpers ───────────────────────────────────────────────

  #dialog    = () => this.querySelector("dialog");
  #trigger   = () => this.querySelector(".cfb-add-session-form__trigger");
  #cancelBtn = () => this.querySelector(".cfb-add-session-form__cancel");
  #addTagBtn = () => this.querySelector(".cfb-add-session-form__add-tag-btn");
  #tagInput  = () => this.querySelector(".cfb-add-session-form__tag-input");
  #tagChips  = () => this.querySelector(".cfb-add-session-form__tag-chips");
  #tagsHidden = () => this.querySelector('input[name="tags"]');

  // ── Dialog open / close ───────────────────────────────────────

  #onTriggerClick = () => this.#dialog().showModal();

  #onBackdropClick = (evt) => {
    if (evt.target === this.#dialog()) this.#dialog().close();
  };

  #onClose = () => this.#dialog().close();

  #onDialogClose = () => {
    this.querySelector("form")?.reset();
    this.#tags = [];
    this.#updateTagChips();
  };

  // ── Tag management ────────────────────────────────────────────

  #onAddTag = () => {
    const input = this.#tagInput();
    const label = input.value.trim();
    if (!label || this.#tags.includes(label)) {
      input.value = "";
      return;
    }
    this.#tags.push(label);
    input.value = "";
    this.#updateTagChips();
  };

  #onTagKeydown = (evt) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.#onAddTag();
    }
  };

  #updateTagChips() {
    const chips = this.#tagChips();
    if (!chips) return;
    chips.innerHTML = this.#tags
      .map(
        (tag) => `
        <span class="cfb-add-session-form__chip" data-tag="${tag}">
          ${tag}
          <button type="button" class="cfb-add-session-form__chip-remove" aria-label="Remove ${tag}">×</button>
        </span>`
      )
      .join("");

    chips.querySelectorAll(".cfb-add-session-form__chip-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.closest("[data-tag]").dataset.tag;
        this.#tags = this.#tags.filter((t) => t !== tag);
        this.#updateTagChips();
      });
    });

    this.#tagsHidden().value = this.#tags.join(",");
  }

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
        sessionType: data.get("sessionType"),
        tags: this.#tags.map((label) => ({ label, color: labelToColor(label) })),
        attendees: parseSpeaker(data.get("speaker") ?? ""),
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

            <div class="cfb-add-session-form__field">
              <label for="cfb-add-title" class="cfb-add-session-form__label">Title</label>
              <input id="cfb-add-title" class="cfb-add-session-form__input"
                name="title" type="text" required minlength="5" />
            </div>

            <div class="cfb-add-session-form__field">
              <label for="cfb-add-day" class="cfb-add-session-form__label">Day</label>
              <select id="cfb-add-day" class="cfb-add-session-form__select" name="day" required>
                <option value="">Select a day…</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div class="cfb-add-session-form__field">
              <label for="cfb-add-room" class="cfb-add-session-form__label">Room</label>
              <input id="cfb-add-room" class="cfb-add-session-form__input"
                name="room" type="text" list="cfb-add-room-list" required autocomplete="off" />
              <datalist id="cfb-add-room-list">
                <option value="Main Hall"></option>
                <option value="Track A"></option>
                <option value="Track B"></option>
                <option value="Workshop Room"></option>
              </datalist>
            </div>

            <fieldset class="cfb-add-session-form__fieldset">
              <legend class="cfb-add-session-form__legend">Session type</legend>
              <label class="cfb-add-session-form__radio-label">
                <input type="radio" name="sessionType" value="Talk" required /> Talk
              </label>
              <label class="cfb-add-session-form__radio-label">
                <input type="radio" name="sessionType" value="Workshop" /> Workshop
              </label>
              <label class="cfb-add-session-form__radio-label">
                <input type="radio" name="sessionType" value="Keynote" /> Keynote
              </label>
              <label class="cfb-add-session-form__radio-label">
                <input type="radio" name="sessionType" value="Lightning Talk" /> Lightning Talk
              </label>
            </fieldset>

            <div class="cfb-add-session-form__field">
              <label for="cfb-add-tag-input" class="cfb-add-session-form__label">
                Tags <span class="cfb-add-session-form__optional">(optional)</span>
              </label>
              <div class="cfb-add-session-form__tag-row">
                <input id="cfb-add-tag-input" class="cfb-add-session-form__input cfb-add-session-form__tag-input"
                  type="text" list="cfb-add-tag-list" placeholder="Add a tag…" autocomplete="off" />
                <datalist id="cfb-add-tag-list">
                  ${KNOWN_TAGS.map((t) => `<option value="${t.label}"></option>`).join("")}
                </datalist>
                <button type="button" class="cfb-add-session-form__add-tag-btn">Add</button>
              </div>
              <div class="cfb-add-session-form__tag-chips"></div>
              <input type="hidden" name="tags" value="" />
            </div>

            <div class="cfb-add-session-form__field">
              <label for="cfb-add-speaker" class="cfb-add-session-form__label">
                Speaker <span class="cfb-add-session-form__optional">(optional)</span>
              </label>
              <input id="cfb-add-speaker" class="cfb-add-session-form__input" name="speaker" type="text" />
            </div>

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
