package findingseams.speakerfeedback

import kotlin.random.Random

class FeedbackSensor {
    /** Simulate an unreliable external device / service. */
    fun readScores(): List<Int>? {
        val outcome = Random.nextDouble()

        if (outcome < 0.05) {
            throw IllegalStateException("Sensor failure")
        }

        if (outcome < 0.1) {
            return null
        }

        val length = 1 + (Random.nextDouble() * 5).toInt()
        return List(length) { 1 + (Random.nextDouble() * 5).toInt() }
    }
}
