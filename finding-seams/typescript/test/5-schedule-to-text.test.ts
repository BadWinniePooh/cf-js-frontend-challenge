import { expect } from 'chai'
import { ScheduleToText } from '../src/schedule-visualising/schedule-to-text.js'

describe.skip('schedule-visualising', () => {
  it('prints as markdown', async () => {
    const scheduleConverter = new ScheduleToText()

    const result = await scheduleConverter.convertToText(Date.parse('2025-11-03'), { includeBreaks: false })

    expect(result).to.eql(`# Conference Schedule – Day 1 (UTC)

* 09:00–10:00 Example Keynote – (Unknown Speaker) @ Main Hall [talk]
* 10:00–11:30 Example workshop – (Unknown Speaker) @ TBD room [workshop]
`)
  })
})
