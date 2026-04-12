package findingseams.roomavailability

data class Room(
    val id: String,
    val name: String,
)

data class TimeSlot(
    val startingTime: String,
    val duration: Int,
)
