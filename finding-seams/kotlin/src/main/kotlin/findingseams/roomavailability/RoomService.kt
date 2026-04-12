package findingseams.roomavailability

sealed class PlaceSessionResult {
    abstract val sessionId: Int
    abstract val roomId: String
    abstract val timeSlot: TimeSlot

    data class Accepted(
        override val sessionId: Int,
        override val roomId: String,
        override val timeSlot: TimeSlot,
        val status: String = "ACCEPTED",
    ) : PlaceSessionResult()

    data class Rejected(
        override val sessionId: Int,
        override val roomId: String,
        override val timeSlot: TimeSlot,
        val status: String = "REJECTED",
        val reason: String,
    ) : PlaceSessionResult()
}

class RoomService {
    fun placeSessionInRoom(sessionId: Int, roomId: String, timeSlot: TimeSlot): PlaceSessionResult {
        if (!roomRegistry.isAvailable(roomId, timeSlot)) {
            return PlaceSessionResult.Rejected(
                sessionId = sessionId,
                roomId = roomId,
                timeSlot = timeSlot,
                reason = "Room not available",
            )
        }
        roomRegistry.reserve(roomId, timeSlot)
        return PlaceSessionResult.Accepted(
            sessionId = sessionId,
            roomId = roomId,
            timeSlot = timeSlot,
        )
    }
}
