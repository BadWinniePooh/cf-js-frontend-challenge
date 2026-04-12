package findingseams.remindersender

data class Reminder(
    val id: String,
    val email: String,
    val sendAt: Any? = null,
)
