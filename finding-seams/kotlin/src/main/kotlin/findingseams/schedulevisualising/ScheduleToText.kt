package findingseams.schedulevisualising

import com.google.gson.JsonArray
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

private val CONFERENCE_START = Instant.parse("2025-11-03T00:00:00Z")
private const val CONFERENCE_DURATION_DAYS = 3
private val MS_PER_DAY = 1000L * 60 * 60 * 24

private val TIMEZONE_OFFSETS = mapOf(
    "UTC" to 0,
    "Europe/Helsinki" to 120,
    "Europe/Stockholm" to 60,
    "Europe/London" to 0,
    "America/New_York" to -300,
    "America/Chicago" to -360,
    "America/Los_Angeles" to -480,
)

private val SUPPORTED_LOCALES = setOf("en-US", "en-GB", "fi-FI", "sv-SE", "de-DE")

data class ConvertToTextOptions(
    val timezone: String = "UTC",
    val locale: String? = null,
    val track: String = "all",
    val includeBreaks: Boolean? = null,
    val types: List<String>? = null,
)

class ScheduleToText(
    private val formatter: ScheduleFormatter = ScheduleFormatter(),
) {
    suspend fun convertToText(dateInput: Any, options: ConvertToTextOptions = ConvertToTextOptions()): String =
        withContext(Dispatchers.IO) {
            val requested = coerceDate(dateInput) ?: return@withContext "Invalid date provided.\n"

            val dayIndex = ((requested.toEpochMilli() - CONFERENCE_START.toEpochMilli()) / MS_PER_DAY).toInt()
            if (dayIndex < 0 || dayIndex >= CONFERENCE_DURATION_DAYS) {
                val human = DateTimeFormatter.RFC_1123_DATE_TIME.withZone(ZoneOffset.UTC).format(requested)
                return@withContext "No schedule available for $human.\n"
            }

            val conferenceDay = dayIndex + 1
            val dateString = toDateString(requested)

            val tzName = options.timezone
            val timezoneOffset = TIMEZONE_OFFSETS[tzName] ?: 0
            val locale = options.locale?.takeIf { it in SUPPORTED_LOCALES } ?: "en-US"
            val track = options.track
            val includeBreaks = options.includeBreaks != false
            val allowedTypes = options.types ?: listOf("talk", "workshop", "break")

            val resourcePath = "/schedule/schedule-$dateString.json"
            val stream = ScheduleToText::class.java.getResourceAsStream(resourcePath)
                ?: return@withContext "Invalid date provided.\n"
            val raw = InputStreamReader(stream, StandardCharsets.UTF_8).use { it.readText() }
            val root = JsonParser.parseString(raw).asJsonObject
            val sessionsArray = root.getAsJsonArray("sessions") ?: JsonArray()

            var sessions = sessionsArray.mapNotNull { parseSession(it.asJsonObject) }.toMutableList()
            if (track != "all") {
                sessions = sessions.filter { it.track == track || it.track == "all" }.toMutableList()
            }
            if (!includeBreaks) {
                sessions = sessions.filter { it.type != "break" }.toMutableList()
            }
            sessions = sessions.filter { it.type != null && it.type in allowedTypes }.toMutableList()

            val formattingOptions = ScheduleFormatOptions(
                locale = locale,
                timezoneOffset = timezoneOffset,
                conferenceDay = conferenceDay,
                timezone = tzName,
            )
            formatter.format(ScheduleObject(sessions), formattingOptions)
        }

    private fun coerceDate(dateInput: Any): Instant? =
        when (dateInput) {
            is Instant -> dateInput
            is Number -> Instant.ofEpochMilli(dateInput.toLong())
            is String -> {
                if (dateInput.all { it.isDigit() }) {
                    Instant.ofEpochMilli(dateInput.toLong())
                } else {
                    try {
                        Instant.parse(dateInput)
                    } catch (_: Exception) {
                        try {
                            java.time.LocalDate.parse(dateInput).atStartOfDay(ZoneOffset.UTC).toInstant()
                        } catch (_: Exception) {
                            null
                        }
                    }
                }
            }
            else -> null
        }

    private fun toDateString(instant: Instant): String {
        val d = instant.atZone(ZoneOffset.UTC).toLocalDate()
        return "%04d-%02d-%02d".format(d.year, d.monthValue, d.dayOfMonth)
    }

    private fun parseSession(o: JsonObject): ScheduleSession {
        fun str(key: String): String? =
            if (!o.has(key) || o.get(key).isJsonNull) null else o.get(key).asString

        fun intOrNull(key: String): Int? =
            if (!o.has(key) || o.get(key).isJsonNull) null else o.get(key).asInt

        return ScheduleSession(
            start = str("start"),
            length = intOrNull("length"),
            title = str("title"),
            speaker = str("speaker"),
            room = str("room"),
            track = str("track"),
            type = str("type"),
        )
    }
}
