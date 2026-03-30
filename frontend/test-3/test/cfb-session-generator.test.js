import { use, expect } from 'chai'
import { schemaMatcher } from '../../testing-utils/src/chai-helpers.js'
import { sessionDetailsSchema } from '../../test-2/contracts/session-details.schema.js'
import { EventTypes } from '../../step-3/events.js'
import { fixture, cleanup } from './helpers/fixture.js'
import { CfbSessionGenerator } from '../../step-3/cfb-session-generator.js'

use(schemaMatcher)

customElements.define('cfb-session-generator', CfbSessionGenerator)

describe('<cfb-session-generator> — event dispatch', () => {
  afterEach(cleanup)

  it('dispatches the event with bubbles: true', async () => {
    const el = await fixture('<cfb-session-generator></cfb-session-generator>')

    let captured = null
    el.addEventListener(EventTypes.SESSION_CREATED, (e) => {
      captured = e
    })
    el.querySelector('button').click()

    expect(captured.bubbles).to.be.true
  })

  it('session in the event detail matches the sessionDetails schema', async () => {
    const el = await fixture('<cfb-session-generator></cfb-session-generator>')

    let detail = null
    el.addEventListener(EventTypes.SESSION_CREATED, (e) => {
      expect(e.detail._type).to.eql(EventTypes.SESSION_CREATED)
      detail = e.detail
    })
    el.querySelector('button').click()

    const { _type, ...session } = detail
    expect(session).to.matchSchema(sessionDetailsSchema)
  })

  it('generates a unique id on each click', async () => {
    const el = await fixture('<cfb-session-generator></cfb-session-generator>')

    const ids = []
    el.addEventListener(EventTypes.SESSION_CREATED, (e) => {
      ids.push(e.detail.id)
    })

    el.querySelector('button').click()
    el.querySelector('button').click()

    expect(ids).to.have.length(2)
    expect(ids[0]).to.not.equal(ids[1])
  })
})
