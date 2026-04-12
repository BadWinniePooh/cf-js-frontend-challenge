import { expect } from 'chai'
import { BadgePrinting } from '../src/badge-printing/badge-printing.js'

describe.skip('badge-printing', () => {
  it('prints a badge', () => {
    const badgeDispenser = new BadgePrinting()

    const { id, name, pronouns } = badgeDispenser.createBadge('Test person', 'they/them')

    expect({ id, name, pronouns }).to.eql({ id: 'CONF-1', name: 'Test person', pronouns: 'they/them' })
  })

  it('prints second badge', () => {
    const badgeDispenser = new BadgePrinting()

    const { id, name, pronouns } = badgeDispenser.createBadge('Test person', 'they/them')

    expect({ id, name, pronouns }).to.eql({ id: 'CONF-2', name: 'Test person', pronouns: 'they/them' })
  })
})
