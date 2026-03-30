import { CfbSessionLoader } from '../../step-4/cfb-session-loader.js'
import { cleanup } from './helpers/fixture.js'

customElements.define('cfb-session-loader', CfbSessionLoader)

describe('<cfb-session-loader>', () => {
  afterEach(async () => {
    cleanup()
  })

  it('your fist test case', async () => {
  })
})
