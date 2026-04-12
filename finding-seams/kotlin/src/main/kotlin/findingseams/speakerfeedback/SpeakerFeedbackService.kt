package findingseams.speakerfeedback

data class EvaluateSpeakerResult(
    val status: String,
    val averageScore: Double?,
)

class SpeakerFeedbackService(
    private val sensor: FeedbackSensor = FeedbackSensor(),
) {
    private val alertThreshold = 2.2

    fun evaluateSpeaker(): EvaluateSpeakerResult {
        val scores = sensor.readScores()

        if (scores == null || scores.isEmpty()) {
            return EvaluateSpeakerResult("ALERT", null)
        }

        val validScores = scores.filter { it in 1..5 }
        if (validScores.isEmpty()) {
            return EvaluateSpeakerResult("ALERT", null)
        }

        val average = validScores.sum().toDouble() / validScores.size
        return if (average < alertThreshold) {
            EvaluateSpeakerResult("ALERT", average)
        } else {
            EvaluateSpeakerResult("OK", average)
        }
    }
}
