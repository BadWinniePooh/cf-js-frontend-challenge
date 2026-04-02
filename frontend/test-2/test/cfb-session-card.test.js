import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { expect } from 'chai'
import { fixture, cleanup } from './helpers/fixture.js'
//import { sessionDetails } from '../../step-2/builds-session-details.js'
//import { Randomizer } from './helpers/randomizer.js'

customElements.define('cfb-tag', CfbTag)
customElements.define('cfb-session-card', CfbSessionCard)

const SESSION = {
  title: 'Opening Keynote',
  tags: [
    { label: 'Keynote', color: 'blue' },
    { label: 'Frontend', color: 'green' },
  ],
  attendees: [
    { name: 'Alice Kent', initials: 'AK' },
    { name: 'James Smith', initials: 'JS' },
    { name: 'Maria R', initials: 'MR' },
  ],
}

describe('<cfb-session-card>', () => {
  afterEach(cleanup)

  describe('title', () => {
    it('renders the title', async () => {
      const el = await fixture(`<cfb-session-card data-session-details='${JSON.stringify(SESSION)}'></cfb-session-card>`)
      const titleEl = el.querySelector('.cfb-card__title')
      expect(titleEl).to.exist
      expect(titleEl.textContent).to.equal(SESSION.title)
    })
    it('updates the title when data-session-details changes', async () => {
      const el = await fixture(`<cfb-session-card data-session-details='${JSON.stringify(SESSION)}'></cfb-session-card>`)
      const updated = {...SESSION, title: 'Updated Title'};      
      
      el.setAttribute(CfbSessionCard.definedAttributes.details, JSON.stringify(updated));
            
      const titleEl = el.querySelector('.cfb-card__title')
      expect(titleEl).to.exist
      expect(titleEl.textContent).to.equal(updated.title)
    })
  })

  describe('tags', () => {
  })

  describe('attendees', () => {
  })

  describe('data-session-details reactivity', () => {
  })
})
