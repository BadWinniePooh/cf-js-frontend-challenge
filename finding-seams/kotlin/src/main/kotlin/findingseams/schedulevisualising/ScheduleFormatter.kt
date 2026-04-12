package findingseams.schedulevisualising

data class ScheduleSession(
    val start: String? = null,
    val length: Int? = null,
    val title: String? = null,
    val speaker: String? = null,
    val room: String? = null,
    val track: String? = null,
    val type: String? = null,
)

data class ScheduleObject(
    val sessions: List<ScheduleSession>,
)

data class ScheduleFormatOptions(
    val locale: String = "en-US",
    val timezoneOffset: Int = 0,
    val conferenceDay: Int? = null,
    val timezone: String = "UTC",
)

class ScheduleFormatter {
    fun format(scheduleObject: ScheduleObject?, options: ScheduleFormatOptions = ScheduleFormatOptions()): String {
        @Suppress("UNUSED_VARIABLE")
        val _unusedLocale = options.locale

        if (scheduleObject == null) {
            return "No sessions available.\n"
        }

        val sorted = scheduleObject.sessions.sortedWith { a, b ->
            when {
                a.start.isNullOrEmpty() && b.start.isNullOrEmpty() -> 0
                a.start.isNullOrEmpty() -> 1
                b.start.isNullOrEmpty() -> -1
                else -> a.start!!.compareTo(b.start!!)
            }
        }

        val dayLabel = options.conferenceDay?.let { "Day $it" } ?: "Conference"
        val tzLabel = if (options.timezoneOffset == 0) "UTC" else options.timezone

        val sb = StringBuilder()
        sb.append("# Conference Schedule – ").append(dayLabel).append(" (").append(tzLabel).append(")\n\n")

        for (session in sorted) {
            val title = session.title ?: "Untitled Session"
            val speaker = session.speaker?.let { " – $it" } ?: ""
            val room = session.room ?: "TBD"
            val displayStart = shiftTime(session.start ?: "??:??", options.timezoneOffset)
            val displayEnd = session.length?.let { len ->
                shiftTime(addMinutes(session.start ?: "00:00", len), options.timezoneOffset)
            }
            val timeRange = displayEnd?.let { "$displayStart–$it" } ?: displayStart
            val typeTag = session.type?.let { " [$it]" } ?: ""
            sb.append("* ").append(timeRange).append(' ').append(title).append(speaker)
                .append(" @ ").append(room).append(typeTag).append('\n')
        }
        return sb.toString()
    }

    private fun shiftTime(timeStr: String, offsetMinutes: Int): String {
        if (timeStr.isEmpty() || timeStr.contains('?')) return timeStr
        val parts = timeStr.split(':')
        val h = parts.getOrNull(0)?.toIntOrNull() ?: 0
        val m = parts.getOrNull(1)?.toIntOrNull() ?: 0
        val totalMinutes = h * 60 + m + offsetMinutes
        val normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
        val adjH = normalized / 60
        val adjM = normalized % 60
        return "%02d:%02d".format(adjH, adjM)
    }

    private fun addMinutes(timeStr: String, minutes: Int): String {
        val parts = timeStr.split(':')
        val h = parts.getOrNull(0)?.toIntOrNull() ?: 0
        val m = parts.getOrNull(1)?.toIntOrNull() ?: 0
        val total = h * 60 + m + minutes
        val endH = (total / 60) % 24
        val endM = total % 60
        return "%02d:%02d".format(endH, endM)
    }
}
