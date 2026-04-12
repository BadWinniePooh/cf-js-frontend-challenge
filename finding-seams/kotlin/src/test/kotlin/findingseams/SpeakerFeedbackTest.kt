package findingseams

import findingseams.speakerfeedback.EvaluateSpeakerResult
import findingseams.speakerfeedback.SpeakerFeedbackService
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

//@Disabled("Exercise: finding seams — enable when working on speaker feedback")
class SpeakerFeedbackTest {
    @Test
    fun `calculates average score`() {
        val speakerFeedback = SpeakerFeedbackService()

        val result = speakerFeedback.evaluateSpeaker()

        assertEquals(EvaluateSpeakerResult("OK", 3.6), result)
    }
}
