package findingseams.remindersender

import kotlinx.coroutines.delay
import kotlin.random.Random

object SendReminders {
    /** Do not change: mimics slow, flaky production behaviour. */
    suspend fun send(reminder: Reminder) {
        println("Sending reminder ${reminder.id} to ${reminder.email}")
        delay(1100)
        if (Random.nextDouble() < 0.40) {
            error("Failed to send reminder")
        }
    }
}
