import { cfbSessionRemoved } from './events.js'
import getSessionTypeClass from '../step-4/lib/session-types.js'

// Single responsibility: know about sessions.
// The flip animation lives in <cfb-flip-card>.
// The edit form lives in <cfb-edit-session-form>.
// This card just wires them together.
function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
}

export class CfbSessionCard extends HTMLElement {
  static elementName = 'cfb-session-card'
  static definedAttributes = { details: 'data-session-details' }

  #sessionDetails = null

  static get observedAttributes() {
    return [CfbSessionCard.definedAttributes.details]
  }

  connectedCallback() {
    // ✨ add event listeners here for Editing etc.
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return
    if (name === CfbSessionCard.definedAttributes.details) {
      this.#sessionDetails = JSON.parse(newValue)
      this.#render(this.#sessionDetails)
    }
  }

  disconnectedCallback() {
    // ✨ remove event listeners here for Editing etc.
  }

  // ── Render ────────────────────────────────────────────────────

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

    this.innerHTML = `
    <cfb-flip-card>
      <article slot="front" class="${articleClasses}" ${articleAria} role="article">
        <header class="cfb-card__header">
          <span class="cfb-card__title"${titleAriaHidden}><span class="cfb-card__title-text">${sessionDetails.title}</span></span>
          <cfb-menu>
            <button class="cfb-card__dropdown-item" role="menuitem" data-action="edit">Edit</button>
            <button class="cfb-card__dropdown-item cfb-card__dropdown-item--danger" role="menuitem" data-action="remove">Remove</button>
          </cfb-menu>
        </header>
        <div class="cfb-card__tags"> ${tags.join('')} </div>
        <footer>
          <div class="cfb-avatars" aria-label="Attendees"> ${avatars.join('')} </div>
        </footer>
      </article>
      
      <cfb-edit-session-form slot="back"></cfb-edit-session-form>
    </cfb-flip-card>`

    this.querySelector('[data-action="edit"]').addEventListener('click', () => {
      this.querySelector('cfb-edit-session-form').populate(this.#sessionDetails)
      this.querySelector('cfb-flip-card').flip()
    })

    this.querySelector('[data-action="remove"]').addEventListener('click', () => {
      this.dispatchEvent(cfbSessionRemoved(this.#sessionDetails.id))
    })
  }

  // ── Edit outcome handlers ─────────────────────────────────────

  #onEditSaved = (evt) => {
    // ✨ if saved, unflitp, and then dispatch the `evt`
    this.querySelector('cfb-flip-card').unflip(() => {
      this.querySelector('cfb-edit-session-form').reset()
      this.dispatchEvent(evt.detail.sessionUpdatedEvent)
    })
  }

  #onEditCancelled = () => {
    // ✨ if edit cancelled, just reset the form after unflipping.
    this.querySelector('cfb-flip-card').unflip(() => {
      this.querySelector('cfb-edit-session-form').reset()
    })
  }
}
