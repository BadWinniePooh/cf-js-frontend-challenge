// This is a Molecule, a new construct to have a behavior of opening/closing a dropdown.
export class CfbMenu extends HTMLElement {
  static elementName = 'cfb-menu'

  connectedCallback() {
    this.classList.add('cfb-menu')
    const items = [...this.children]

    this.innerHTML = `
      <button class="cfb-card__menu" aria-label="Card options" aria-haspopup="true" aria-expanded="false">
        <span class="cfb-card__menu-icon"></span>
      </button>
      <div class="cfb-card__dropdown" role="menu" hidden></div>
    `

    const dropdown = this.querySelector('.cfb-card__dropdown')
    items.forEach(item => dropdown.appendChild(item))

    this.querySelector('.cfb-card__menu').addEventListener('click', this.#toggleMenu.bind(this))
  }

  disconnectedCallback() {
    this.querySelector('.cfb-card__menu').removeEventListener('click', this.#toggleMenu)
    document.removeEventListener('click', this.#handleOutsideClick)
  }

  #toggleMenu(event) {
    event.stopPropagation()
    const dropdown = this.querySelector('.cfb-card__dropdown')
    const isOpen = !dropdown.hidden

    if (isOpen) {
      this.#closeMenu()
    } else {
      this.#openMenu()
    }
  }

  #openMenu() {
    this.withMenuAndDropdown((menu, dropdown) => {
      dropdown.hidden = false
      this.querySelector('.cfb-card__menu').setAttribute('aria-expanded', 'true')
      document.addEventListener('click', this.#handleOutsideClick)
    })
  }

  #closeMenu() {
    this.withMenuAndDropdown((menu, dropdown) => {
      dropdown.hidden = true
      menu.setAttribute('aria-expanded', 'false')
      document.removeEventListener('click', this.#handleOutsideClick)
    })
  }

  withMenuAndDropdown(cb) {
    const menu = this.querySelector('.cfb-card__menu')
    const dropdown = this.querySelector('.cfb-card__dropdown')
    if (!menu || !dropdown) return
    cb(menu, dropdown)
  }

  #handleOutsideClick = (event) => {
    if (!this.contains(event.target)) {
      this.#closeMenu()
    }
  }
}
