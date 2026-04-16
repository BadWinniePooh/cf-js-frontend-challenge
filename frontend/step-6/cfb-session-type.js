import { SessionTypes } from "./lib/session-types.js";

// Form-associated custom element — session type as selectable tiles.
// Uses ElementInternals so the value joins FormData and participates in
// constraint validation (required + native reportValidity).

export class CfbSessionType extends HTMLElement {
  static elementName = "cfb-session-type";
  static formAssociated = true;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  connectedCallback() {
    this.addEventListener("click", this.#onClick);
    this._value = this.getAttribute("value") ?? "talk";
    this.#renderTile(this._value);
    this.#updateValidity();
  }

  formResetCallback() {
    this._selected = false;
    this._internals.setFormValue(null);
    this._updateUI();
    this.#updateValidity();
  }

  set checked(val) {
    this._selected = !!val;
    this._internals.setFormValue(this._selected ? this._value : null);
    this._updateUI();
    this.#updateValidity();
  }

  #onClick() {
    // Deselect siblings with same name in this form
    const name = this.getAttribute("name");
    this._internals.form
      ?.querySelectorAll(`cfb-session-type[name="${name}"]`)
      .forEach((el) => {
        if (el !== this) el.checked = false;
      });

    console.log(name, "clicked");

    this._selected = !this._selected;
    this._internals.setFormValue(this._selected ? this._value : null);
    this._updateUI();
    this.#updateValidity();
  }

  _updateUI() {
    this.querySelector(".cfb-session-type__tile")?.classList.toggle(
      "cfb-session-type__tile--selected",
      !!this._selected,
    );
  }

  #renderTile(sessionType) {
    const { icon, label } = SessionTypes[sessionType];
    this.innerHTML = `
      <div class="cfb-session-type__tile">
        <span class="cfb-session-type__icon">${icon}</span>
        <span class="cfb-session-type__label">${label}</span>
      </div>
    `;
  }

  #updateValidity() {
    if (this.required && !this._selected) {
      this._internals.setValidity(
        { valueMissing: true },
        "Please select a session type",
        this.querySelector(".cfb-session-type__tile"),
      );
    } else {
      this._internals.setValidity({});
    }
  }
}
