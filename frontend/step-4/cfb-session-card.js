import { cfbSessionRemoved } from './events.js'
import getSessionTypeClass from './lib/session-types.js'

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
}

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

    const sessionType = sessionDetails.sessionType?.trim() ?? ''
    const hasSessionType = Boolean(sessionType)
    const articleClasses = [
      'cfb-card',
      hasSessionType && 'cfb-card--session-type',
      getSessionTypeClass(sessionType)
    ].filter(Boolean).join(' ')

    const articleAria = hasSessionType
      ? ` aria-label="${escapeAttr(`${sessionDetails.title}. Session type: ${sessionType}.`)}"`
      : ''

    const titleAriaHidden = hasSessionType ? ' aria-hidden="true"' : ''

    this.innerHTML =
      `<article class="${articleClasses}"${articleAria} role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title"${titleAriaHidden}><span class="cfb-card__title-text">${sessionDetails.title}</span></span>
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

    if (hasSessionType) {
      // OMG this is nice.
      this.querySelector('article.cfb-card').style.setProperty(
        '--cfb-session-type-suffix',
        JSON.stringify(` (${sessionType})`),
      )
    }

    this.querySelector('[data-action="remove"]').addEventListener('click', () => {
      this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
    })
  }
}
