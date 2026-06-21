export class CfbEditSessionForm extends HTMLElement {
  static elementName = 'cfb-edit-session-form'

  #tags    = []
  #session = null

  connectedCallback() {
    this.#render()
  }

  disconnectedCallback() {
  }

  #render() {
    this.innerHTML = `
            Copy from step-5 and update 
        `
  }
}
