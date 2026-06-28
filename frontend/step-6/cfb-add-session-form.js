export class CfbAddSessionForm extends HTMLElement {
  static elementName = 'cfb-add-session-form'

  connectedCallback() {
    console.log('Copy cfb-add-session-form.js from step-5!!!')
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
                    <p>Copy this whole page from Step-5</p>
                </div>
            </dialog>
`
  }
}
