import { expect } from 'chai'
import { cleanup, fixture } from './helpers/fixture.js'
import { cfbSessionCreated } from '../../step-3/events.js'
import { sessionDetails } from '../../step-2/builds-session-details.js'
import { Randomizer } from '../../test-2/test/helpers/randomizer.js'
import { CfbBoardOrchestrator } from '../../step-3/cfb-board-orchestrator.js'

customElements.define('cfb-board-orchestrator', CfbBoardOrchestrator)

const randomSession = sessionWith()

describe('<cfb-board-orchestrator>', () => {
  afterEach(cleanup)

  it('sets data-sessions on cfb-schedule after a session-created event', async () => {
    const el = await fixture(`
      <cfb-board-orchestrator>
        <div class="any"></div>
        <div class="cfb-updates-schedule"></div>
      </cfb-board-orchestrator>
    `)
    const schedule = el.querySelector('.cfb-updates-schedule')

    el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 's1' })))
    // await tick(0)

    const sessions = JSON.parse(schedule.getAttribute('data-sessions'))
    expect(sessions.some(s => s.id === 's1')).to.be.true
  })

  it('does not mix up sessions from different ids', async () => {
    const el = await fixture(`
      <cfb-board-orchestrator>
        <cfb-schedule class="cfb-updates-schedule"></cfb-schedule>
      </cfb-board-orchestrator>
    `)
    const schedule = el.querySelector('.cfb-updates-schedule')

    el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 'alpha' })))
    el.dispatchEvent(cfbSessionCreated(sessionWith({ id: 'beta' })))
    await Promise.resolve()

    const sessions = JSON.parse(schedule.getAttribute('data-sessions'))
    const ids = sessions.map((s) => s.id)
    expect(ids).to.include('alpha')
    expect(ids).to.include('beta')
  })

  it.skip('stops responding to events after disconnectedCallback')
})

function sessionWith(mockWith = {}) {
  const randomSession = {
    title: Randomizer.stringOf(10),
    tags: [
      Randomizer.tag(),
      Randomizer.tag()
    ],
    attendees: [
      Randomizer.attendee(),
      Randomizer.attendee(),
      Randomizer.attendee()
    ],
  }

  return sessionDetails({ ...randomSession, ...mockWith })
}


export async function tick(timeoutInMs = 100) {
  return new Promise(resolve => {
    setTimeout(resolve, timeoutInMs)
  })
}
