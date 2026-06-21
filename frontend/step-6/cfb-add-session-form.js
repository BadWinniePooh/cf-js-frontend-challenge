export class CfbAddSessionForm extends HTMLElement {
  static elementName = 'cfb-add-session-form'

  connectedCallback() {
    this.#render()
  }

  disconnectedCallback() {
  }

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
`
  }
}
