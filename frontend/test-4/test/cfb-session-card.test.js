import { expect, use } from 'chai'
import { spy } from 'sinon'
import sinonChai from 'sinon-chai'

import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbMenu } from '../../step-4/cfb-menu.js'
import { CfbSessionCard } from '../../step-4/cfb-session-card.js'
import { fixture, cleanup } from './helpers/fixture.js'

use(sinonChai)

customElements.define('cfb-tag', CfbTag)
customElements.define('cfb-menu', CfbMenu)
customElements.define(CfbSessionCard.elementName, CfbSessionCard)

// ---------------------------------------------------------------------------
// These Aki has in own tests, copied here for ease of use
//
function sessionDetails({ id, title, day, room, tags = [], attendees = [] } = {}) {
  return { id, title, day, room, tags, attendees }
}

const Randomizer = {
  /** Picks one element at random from `items`. */
  fromList(items) {
    return items[Math.floor(Math.random() * items.length)]
  },

  /** Returns a random integer in [min, max] (both inclusive). */
  integer(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },

  /**
   * Builds a random string of exactly `length` characters drawn from `chars`.
   * Defaults to alphanumeric characters.
   */
  stringOf(length, chars = ALPHANUM) {
    return Array.from({ length }, () => this.fromList([...chars])).join('')
  },

  /** Generates a random "First Last" name. */
  name() {
    return `${this.fromList(FIRST_NAMES)} ${this.fromList(LAST_NAMES)}`
  },

  /**
   * Derives uppercase initials from a full name.
   * "Alice Kent" → "AK", "Maria R" → "MR"
   */
  initials(fullName) {
    return fullName
      .split(/\s+/)
      .filter(Boolean)
      .map(part => part[0].toUpperCase())
      .join('')
  },

  /** Picks a random valid tag color. */
  color() {
    return this.fromList(TAG_COLORS)
  },

  /** Builds a random `{ label, color }` tag object. */
  tag() {
    return { label: this.fromList(TAG_LABELS), color: this.color() }
  },

  /** Builds a random `{ name, initials }` attendee object. */
  attendee() {
    const fullName = this.name()
    return { name: fullName, initials: this.initials(fullName) }
  },

  /** Picks a random conference day. */
  day() {
    return this.fromList(['Wednesday', 'Thursday', 'Friday'])
  },

  /** Picks a random conference room. */
  room() {
    return this.fromList(['Main Hall', 'Track A', 'Track B', 'Workshop Room'])
  },
  uuid() {
    return crypto.randomUUID()
  }
}

let R = Randomizer
// End of copied code
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------

function sessionWith(overrides = {}) {
  return sessionDetails({
    id: R.stringOf(6),
    title: R.stringOf(12),
    day: R.day(),
    room: R.room(),
    tags: [R.tag(), R.tag()],
    attendees: [R.attendee(), R.attendee()],
    ...overrides,
  })
}

const cardHtml = (session) =>
  `<cfb-session-card data-session-details='${JSON.stringify(session)}'></cfb-session-card>`

// ---------------------------------------------------------------------------

describe('<cfb-session-card> (step-4)', () => {
  afterEach(cleanup)

  describe('rendering', () => {
    it('renders the session title', async () => {
      const session = sessionWith({ title: 'My Great Talk' })
      const el = await fixture(cardHtml(session))
      expect(el.textContent).to.include('My Great Talk')
    })

    it('renders one <cfb-tag> per tag', async () => {
      const session = sessionWith({ tags: [R.tag(), R.tag(), R.tag()] })
      const el = await fixture(cardHtml(session))
      expect(el.querySelectorAll('cfb-tag').length).to.equal(3)
    })

    it('renders zero tags when the tags array is empty', async () => {
      const session = sessionWith({ tags: [] })
      const el = await fixture(cardHtml(session))
      expect(el.querySelectorAll('cfb-tag').length).to.equal(0)
    })

    it('renders one avatar per attendee', async () => {
      const session = sessionWith({ attendees: [R.attendee(), R.attendee(), R.attendee()] })
      const el = await fixture(cardHtml(session))
      expect(el.querySelectorAll('.cfb-avatar').length).to.equal(3)
    })

    it('renders a <cfb-menu> for the options dropdown', async () => {
      const el = await fixture(cardHtml(sessionWith()))
      expect(el.querySelector('cfb-menu')).to.not.be.null
    })
  })

  describe('Remove action', () => {
    it('includes the session id in the event detail', async () => {
      const session = sessionWith({ id: 'session-42' })
      const el = await fixture(cardHtml(session))

      let captured = null
      el.addEventListener('cfb-session-removed', (e) => {
        captured = e
      })
      el.querySelector('[data-action="remove"]').click()

      expect(captured.detail.sessionId).to.equal('session-42')
    })

    it('cfb-session-removed bubbles up to the parent', async () => {
      const session = sessionWith({ id: 'bubbles-test' })
      const el = await fixture(cardHtml(session))

      // One can also use Sinon to do this
      const eventSpy = spy()
      el.parentElement.addEventListener('cfb-session-removed', eventSpy)

      el.querySelector('[data-action="remove"]').click()

      expect(eventSpy).to.have.been.calledOnce
    })
  })
})

// ---------------------------------------------------------------------------
// This is where the Randomizer lives

const FIRST_NAMES = [
  'Alice', 'Bob', 'Carol', 'David', 'Emma',
  'Felix', 'Grace', 'Hugo', 'Iris', 'James',
  'Kira', 'Lena', 'Maria', 'Niko', 'Olivia',
  'Pekka', 'Quinn', 'Rosa', 'Sami', 'Tina',
]

const LAST_NAMES = [
  'Aalto', 'Brown', 'Davis', 'Evans', 'Ford',
  'Grant', 'Hall', 'Ikonen', 'Jones', 'Kent',
  'Korhonen', 'Lee', 'Mäkinen', 'Nguyen', 'Ojala',
  'Park', 'Rantanen', 'Smith', 'Virtanen', 'Ylinen',
]

const TAG_LABELS = [
  'Architecture', 'Backend', 'DevOps', 'Frontend',
  'Keynote', 'Lightning Talk', 'Open Space',
  'Security', 'Testing', 'Workshop',
]

const TAG_COLORS = ['blue', 'green', 'orange', 'purple', 'red']

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = LOWER.toUpperCase()
const DIGITS = '0123456789'
const ALPHANUM = LOWER + UPPER + DIGITS
// ---------------------------------------------------------------------------
