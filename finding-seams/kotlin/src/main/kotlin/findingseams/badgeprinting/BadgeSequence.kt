package findingseams.badgeprinting

/** Global singleton-style sequence generator with hidden state. */
object BadgeSequence {
    private var sequenceNumber = 0

    fun nextId(): Int {
        sequenceNumber += 1
        return sequenceNumber
    }
}
