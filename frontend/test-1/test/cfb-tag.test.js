import { CfbTag } from '../../step-1/cfb-tag.js'
import { expect } from '@esm-bundle/chai'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get('cfb-tag')) {
  customElements.define('cfb-tag', CfbTag)
}

afterEach(cleanup)

describe('<cfb-tag>', () => {
  describe('rendering', () => {
    // Add some tests for rendering
  })

  describe('attribute reactivity', () => {
    // Add some tests for re-rendering after attribute change
  })
})
