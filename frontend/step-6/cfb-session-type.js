// Form-associated custom element — session type as selectable tiles.
// Uses ElementInternals so the value joins FormData and participates in
// constraint validation (required + native reportValidity).

export class CfbSessionType extends HTMLElement {
  static elementName = 'cfb-session-type'
  static formAssociated = true
  // TODO: This is your magic
  constructor(){
    super()
    this.internals = this.attachInternals()
  }

  #sessionTypes = {
    talk: { icon: '🎤', label: 'Talk' },
    workshop: { icon: '🛠️', label: 'Workshop' },
    keynote: { icon: '👥', label: 'Keynote' },
    lightning: { icon: '⚡', label: 'Lightning Talk' },
  }

  connectedCallback() {
//    this.classList.add('cfb-session-type')
//    this.addEventListener('click', this.#handleClick)
  }

  #renderTile(sessionType) {
    const { icon, label } = this.#sessionTypes[sessionType]
    this.innerHTML = `
      <div class="cfb-session-type__tile">
        <span class="cfb-session-type__icon">${icon}</span>
        <span class="cfb-session-type__label">${label}</span>
      </div>
    `
  }

}

