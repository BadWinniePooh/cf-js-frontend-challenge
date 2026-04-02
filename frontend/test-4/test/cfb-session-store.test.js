import { CfbSessionStore } from '../../step-4/cfb-session-store.js'
import { cleanup } from './helpers/fixture.js'

customElements.define('cfb-session-store', CfbSessionStore)

describe('<cfb-session-store>', () => {
  afterEach(async () => {
    cleanup()
  })

  describe('on SESSION_CREATED', () => {
    it('your first test case', async () => {
    })
  })

  describe.only('on SESSION_REMOVED', () => {
    it('your first test case ', async () => {
    })
  })
})
