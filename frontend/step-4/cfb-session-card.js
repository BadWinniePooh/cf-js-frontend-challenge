import { cfbSessionRemoved } from './events.js'

// The change from step 2:
//   - The hamburger menu is now a custom element, and the card now has a dropdown menu.
//   - Clicking on the 'Remove' button dispatches a custom event.'
export class CfbSessionCard extends HTMLElement {
  static elementName = 'cfb-session-card'
  static definedAttributes = { details: 'data-session-details' }

  #sessionDetails = null

  static get observedAttributes() {
    return [CfbSessionCard.definedAttributes.details]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) {
      return
    }

    if (name === CfbSessionCard.definedAttributes.details) {
      this.#sessionDetails = JSON.parse(newValue)
      this.#render(this.#sessionDetails)
    }
  }

  #render(sessionDetails) {
    const tags = sessionDetails.tags
      .map(tag => `<cfb-tag data-label="${tag.label}" data-color="${tag.color}"></cfb-tag>`)

    const avatars = sessionDetails.attendees
      .map(attendee => `<div class="cfb-avatar" aria-label="${attendee.name}">${attendee.initials}</div>`)

    this.innerHTML =
      `<article class="cfb-card cfb-card--travel" role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title">${sessionDetails.title}</span>
          <cfb-menu>
            <button class="cfb-card__dropdown-item" role="menuitem" data-action="edit">Edit</button>
            <button class="cfb-card__dropdown-item cfb-card__dropdown-item--danger" role="menuitem" data-action="remove">Remove</button>
          </cfb-menu>
        </header>
        <!-- ATOM: tags row -->
        <div class="cfb-card__tags">
          ${tags.join('')}
        </div>
        <footer>
          <div class="cfb-avatars" aria-label="Attendees">
            ${avatars.join('')}
          </div>
        </footer>
      </article>`

    this.querySelector('[data-action="remove"]').addEventListener('click', () => {
      // TODO: you might want to test this.
      this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
    })
  }
}
