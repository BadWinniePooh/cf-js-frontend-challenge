package findingseams

import findingseams.schedulevisualising.ConvertToTextOptions
import findingseams.schedulevisualising.ScheduleToText
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import java.time.Instant
import kotlin.test.assertEquals

@Disabled("Exercise: finding seams — enable when working on schedule to text")
class ScheduleToTextTest {
    @Test
    fun `prints as markdown`() = runBlocking {
        val scheduleConverter = ScheduleToText()
        val tsMs = Instant.parse("2025-11-03T00:00:00Z").toEpochMilli()

        val result = scheduleConverter.convertToText(
            tsMs,
            ConvertToTextOptions(includeBreaks = false),
        )

        assertEquals(
            """
            # Conference Schedule – Day 1 (UTC)

            * 09:00–10:00 Example Keynote – (Unknown Speaker) @ Main Hall [talk]
            * 10:00–11:30 Example workshop – (Unknown Speaker) @ TBD room [workshop]
            """.trimIndent() + "\n",
            result,
        )
    }
}
