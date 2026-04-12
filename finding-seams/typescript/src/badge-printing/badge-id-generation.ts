// Global singleton-style sequence generator with hidden state.
class BadgeIdGeneration {
  #sequenceNumber = 0

  nextId(): number {
    return ++this.#sequenceNumber
  }
}

export const badgeSequence = new BadgeIdGeneration()
