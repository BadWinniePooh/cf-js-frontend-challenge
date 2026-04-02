import { CfbBoardOrchestrator } from '../../step-4/cfb-board-orchestrator.js'
import { cleanup } from './helpers/fixture.js'

customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)

// No IDB involved — the step-4 orchestrator is stateless:
// it only listens to sessionsLoaded and writes data-sessions to .cfb-updates-schedule.

describe('<cfb-board-orchestrator>', () => {
  afterEach(cleanup)

  it('your first test case', async () => {
  })
})
