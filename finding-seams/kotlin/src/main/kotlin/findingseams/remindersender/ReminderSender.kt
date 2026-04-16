package findingseams.remindersender

import java.time.Instant
import java.time.format.DateTimeFormatter

class ReminderSender(
    private val retryCount: Int = 3,
) {
    suspend fun sendAll(reminders: List<Reminder>) {
        val now = System.currentTimeMillis()
        for (reminder in reminders) {
            val sendAtTime = toTimestamp(reminder.sendAt)
            if (sendAtTime <= now) {
                retryReminderSending(reminder)
            }
        }
    }

    private suspend fun retryReminderSending(reminder: Reminder) {
        var currentCount = 0
        while (true) {
            try {
                SendReminders.send(reminder)
                return
            } catch (_: Exception) {
                println("Error sending reminder:  Retrying...")
            }
            val cond = currentCount < retryCount
            currentCount++
            if (!cond) break
        }
    }

    private fun toTimestamp(value: Any?): Long {
        when (value) {
            null -> return System.currentTimeMillis()
            is Instant -> return value.toEpochMilli()
            is Number -> return value.toLong()
            is String -> {
                if (value.all { it.isDigit() }) {
                    return value.toLong()
                }
                val parsed = runCatching { Instant.parse(value) }.getOrNull()
                    ?: runCatching {
                        java.time.LocalDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME).atZone(
                            java.time.ZoneId.systemDefault(),
                        ).toInstant()
                    }.getOrNull()
                return parsed?.toEpochMilli() ?: System.currentTimeMillis()
            }
            else -> return System.currentTimeMillis()
        }
    }
}
