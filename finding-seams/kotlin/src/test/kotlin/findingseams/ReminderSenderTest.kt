package findingseams

import findingseams.remindersender.Reminder
import findingseams.remindersender.ReminderSender
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.junit.jupiter.api.Test

/** Same wall-clock pressure as Mocha’s default 2000 ms test timeout (see Python `asyncio.wait_for`). */
private const val REMINDER_TEST_TIMEOUT_MS = 2000L

class ReminderSenderTest {
    @Test
    fun `sends reminders qyuickly`() = runBlocking {
        val reminderSender = ReminderSender()

        withTimeout(REMINDER_TEST_TIMEOUT_MS) {
            reminderSender.sendAll(listOf(Reminder(id = "1", email = "foo@example.com")))
        }
    }
}
