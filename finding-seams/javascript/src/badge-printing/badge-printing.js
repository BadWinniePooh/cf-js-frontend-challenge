import { badgeSequence } from './badge-id-generation.js'
import { Badge } from './badge.js'

// Legacy-style dispenser tightly coupled to the global sequence.
export class BadgePrinting {
  #printerDrivers
  #printerConfigs
  #badgeDimensionResolvers
  #printerFactory

  constructor(printerDrivers, printerConfigs, badgeDimensionResolvers, printerFactory) {
    this.#printerDrivers = printerDrivers
    this.#printerConfigs = printerConfigs
    this.#badgeDimensionResolvers = badgeDimensionResolvers
    this.#printerFactory = printerFactory
  }

  createBadge(name, pronouns) {
    const issuedAt = new Date()

    const id = badgeSequence.nextId()
    const formattedId = `CONF-${id}`
    return new Badge(formattedId, name, pronouns, issuedAt)
  }

  /*
  This is a very clumsy method, only to add numerous arguments for constructor, to show that constructor
  injection in this case might not be the best possible option - and should not be used for this exercise.
   */
  printBadge(badge){
    this.#badgeDimensionResolvers.resolve(badge).then(dimensions => {
      this.#printerConfigs.getConfigBasedOnDimensions(dimensions).then(config => {
        const driver = this.#printerDrivers.get('BadgePrinting')
        this.#printerFactory.load(driver, config).then(printer => {
          printer.print(badge)
        })
      })
    })
  }
}

