import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { expect } from '@esm-bundle/chai'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get('cfb-tag')) {
  customElements.define('cfb-tag', CfbTag)
}
if (!customElements.get(CfbSessionCard.elementName)) {
  customElements.define(CfbSessionCard.elementName, CfbSessionCard)
}

afterEach(cleanup)

const SESSION = {
  title: 'Opening Keynote',
  tags: [
    { label: 'Keynote',  color: 'blue'  },
    { label: 'Frontend', color: 'green' },
  ],
  attendees: [
    { name: 'Alice Kent',  initials: 'AK' },
    { name: 'James Smith', initials: 'JS' },
    { name: 'Maria R',     initials: 'MR' },
  ],
}

const sessionHtml = (session = SESSION) =>
  `<cfb-session-card data-session-details='${JSON.stringify(session)}'></cfb-session-card>`

describe('<cfb-session-card>', () => {
  describe('title', () => {
    it('renders the session title', async () => {
      const el = await fixture(sessionHtml())
      expect(el.textContent).to.include('Opening Keynote')
    })
  })

  describe('tags', () => {
    it('renders one <cfb-tag> per tag', async () => {
      const el = await fixture(sessionHtml())
      expect(el.querySelectorAll('cfb-tag').length).to.equal(SESSION.tags.length)
    })

    it('renders zero tags when the tags array is empty', async () => {
      const el = await fixture(sessionHtml({ ...SESSION, tags: [] }))
      expect(el.querySelectorAll('cfb-tag').length).to.equal(0)
    })

    it('passes the correct data-color to each tag', async () => {
      const el = await fixture(sessionHtml())
      const tags = el.querySelectorAll('cfb-tag')
      expect(tags[0].getAttribute('data-color')).to.equal('blue')
      expect(tags[1].getAttribute('data-color')).to.equal('green')
    })
  })

  describe('attendees', () => {
    it('renders one avatar chip per attendee', async () => {
      const el = await fixture(sessionHtml())
      expect(el.querySelectorAll('.cfb-avatar').length).to.equal(SESSION.attendees.length)
    })
  })

  describe('data-session-details reactivity', () => {
    it('re-renders tags when the attribute is replaced', async () => {
      const el = await fixture(sessionHtml())
      const updated = { ...SESSION, tags: [{ label: 'Solo', color: 'red' }] }
      el.setAttribute(CfbSessionCard.definedAttributes.details, JSON.stringify(updated))
      expect(el.querySelectorAll('cfb-tag').length).to.equal(1)
    })
  })
})
