import { expect } from 'chai'
import { CfbMenu } from '../../step-4/cfb-menu.js'
import { fixture, cleanup } from './helpers/fixture.js'

customElements.define('cfb-menu', CfbMenu)


// ---------------------------------------------------------------------------
const menuHtml = (itemsHtml = '') => `<cfb-menu>${itemsHtml}</cfb-menu>`
// ---------------------------------------------------------------------------

describe('<cfb-menu>', () => {
  afterEach(cleanup)

  describe('initial state', () => {
    it('dropdown is hidden on connect', async () => {
      const el = await fixture(menuHtml())
      expect(el.querySelector('.cfb-card__dropdown').hidden).to.be.true
    })

    it('toggle button has aria-expanded="false" on connect', async () => {
      const el = await fixture(menuHtml())
      expect(el.querySelector('.cfb-card__menu').getAttribute('aria-expanded')).to.equal('false')
    })
  })

  describe('opening the menu', () => {
    it('shows the dropdown when the toggle button is clicked', async () => {
      const el = await fixture(menuHtml())
      el.querySelector('.cfb-card__menu').click()
      expect(el.querySelector('.cfb-card__dropdown').hidden).to.be.false
    })

    it('sets aria-expanded="true" when the dropdown is open', async () => {
      const el = await fixture(menuHtml())
      el.querySelector('.cfb-card__menu').click()
      expect(el.querySelector('.cfb-card__menu').getAttribute('aria-expanded')).to.equal('true')
    })
  })

  describe('closing the menu', () => {
    it('hides the dropdown on a second toggle click', async () => {
      const el = await fixture(menuHtml())
      el.querySelector('.cfb-card__menu').click()
      el.querySelector('.cfb-card__menu').click()
      expect(el.querySelector('.cfb-card__dropdown').hidden).to.be.true
    })

    it('resets aria-expanded="false" after closing', async () => {
      const el = await fixture(menuHtml())
      el.querySelector('.cfb-card__menu').click()
      el.querySelector('.cfb-card__menu').click()
      expect(el.querySelector('.cfb-card__menu').getAttribute('aria-expanded')).to.equal('false')
    })

    it('closes when a click is dispatched outside the element', async () => {
      const el = await fixture(menuHtml())
      el.querySelector('.cfb-card__menu').click()  // open

      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(el.querySelector('.cfb-card__dropdown').hidden).to.be.true
    })
  })

  describe('children', () => {
    it('places slotted items inside the dropdown', async () => {
      const el = await fixture(menuHtml(`
        <button data-action="edit">Edit</button>
        <button data-action="remove">Remove</button>
      `))
      const dropdown = el.querySelector('.cfb-card__dropdown')
      expect(dropdown.querySelector('[data-action="edit"]')).to.not.be.null
      expect(dropdown.querySelector('[data-action="remove"]')).to.not.be.null
    })

    it('preserves the number of slotted items', async () => {
      const el = await fixture(menuHtml(`
        <button>One</button>
        <button>Two</button>
        <button>Three</button>
      `))
      expect(el.querySelector('.cfb-card__dropdown').children.length).to.equal(3)
    })
  })
})
