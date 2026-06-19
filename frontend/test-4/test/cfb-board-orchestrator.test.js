import { expect } from 'chai'
import { CfbBoardOrchestrator } from '../../step-4/cfb-board-orchestrator.js'
import { fixture, cleanup } from './helpers/fixture.js'
import { sessionDetails } from '../../step-3/lib/builds-session-details.js'
import { Randomizer as R } from '../../test-2/test/helpers/randomizer.js'
import { cfbSessionsLoadedToIDB } from '../../step-4/events.js'

if (!customElements.get('cfb-board-orchestrator')) {
  customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)
}

// No IDB involved — the step-4 orchestrator is stateless:
// it only listens to sessionsLoaded and writes data-sessions to .cfb-updates-schedule.

describe('<cfb-board-orchestrator>', () => {
  afterEach(cleanup)

  it('your first test case', async () => {
  })
})
