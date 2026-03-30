import { CfbTag } from '../../step-1/cfb-tag.js'
import { CfbSessionCard } from '../../step-2/cfb-session-card.js'
import { expect } from 'chai'
import { fixture, cleanup } from './helpers/fixture.js'
import { sessionDetails } from '../../step-2/builds-session-details.js'
import { Randomizer } from './helpers/randomizer.js'

customElements.define('cfb-tag', CfbTag)
customElements.define(CfbSessionCard.elementName, CfbSessionCard)

describe('<cfb-session-card>', () => {
  afterEach(cleanup)

  describe('title', () => {
  })

  describe('tags', () => {
  })

  describe('attendees', () => {
  })

  describe('data-session-details reactivity', () => {
  })
})
