import { expect } from 'chai'
import { fixture, cleanup } from './helpers/fixture.js'
import { sessionDetails } from '../../step-2/builds-session-details.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'
import { CfbSchedule } from '../../step-3/cfb-schedule.js'

customElements.define('cfb-schedule', CfbSchedule)

describe('<cfb-schedule>', () => {
  afterEach(cleanup)

  describe('with no sessions', () => {
    it('renders a placeholder when no attribute is set', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      expect(el.querySelector('.cfb-schedule__placeholder')).to.not.be.null
    })

    it('renders a placeholder when data-sessions is an empty array', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', '[]')
      expect(el.querySelector('.cfb-schedule__placeholder')).to.not.be.null
    })
  })

  describe('with sessions', () => {
    it('renders one card per session', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', JSON.stringify([
        sessionWith({ day: 'Wednesday' }),
        sessionWith({ day: 'Wednesday' }),
        sessionWith({ day: 'Thursday' }),
      ]))
      expect(el.querySelectorAll('cfb-session-card').length).to.equal(3)
    })

    it('creates one column per distinct day', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', JSON.stringify([
        sessionWith({ day: 'Wednesday' }),
        sessionWith({ day: 'Thursday' }),
      ]))
      expect(el.querySelectorAll('.cfb-column').length).to.equal(2)
    })

    it('groups sessions from the same day into a single column', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', JSON.stringify([
        sessionWith({ day: 'Wednesday' }),
        sessionWith({ day: 'Wednesday' }),
      ]))
      expect(el.querySelectorAll('.cfb-column').length).to.equal(1)
      expect(el.querySelectorAll('cfb-session-card').length).to.equal(2)
    })

    it('labels each column with its day name', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', JSON.stringify([
        sessionWith({ day: 'Thursday' }),
      ]))
      expect(el.querySelector('.cfb-column__heading').textContent.trim()).to.equal('Thursday')
    })

    it('orders columns Wednesday → Thursday → Friday regardless of input order', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', JSON.stringify([
        sessionWith({ day: 'Friday' }),
        sessionWith({ day: 'Wednesday' }),
        sessionWith({ day: 'Thursday' }),
      ]))
      const headings = [...el.querySelectorAll('.cfb-column__heading')]
        .map(h => h.textContent.trim())
      expect(headings).to.deep.equal(['Wednesday', 'Thursday', 'Friday'])
    })
  })

  describe('reactivity', () => {
    it('adds a card when a session is appended to data-sessions', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', JSON.stringify([sessionWith({ day: 'Wednesday' })]))
      el.setAttribute('data-sessions', JSON.stringify([
        sessionWith({ day: 'Wednesday' }),
        sessionWith({ day: 'Wednesday' }),
      ]))
      expect(el.querySelectorAll('cfb-session-card').length).to.equal(2)
    })

    it('shows the placeholder again when data-sessions is cleared', async () => {
      const el = await fixture('<cfb-schedule></cfb-schedule>')
      el.setAttribute('data-sessions', JSON.stringify([sessionWith({ day: 'Wednesday' })]))
      el.setAttribute('data-sessions', '[]')
      expect(el.querySelector('.cfb-schedule__placeholder')).to.not.be.null
    })
  })
})

function sessionWith(mockWith = {}) {
  return sessionDetails({
    id: R.stringOf(6),
    title: R.stringOf(12),
    day: R.day(),
    room: R.room(),
    tags: [R.tag()],
    attendees: [R.attendee()],
    ...mockWith,
  })
}
