package findingseams.roomavailability

import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.regex.Pattern

class RoomRegistry {
    private val rooms = mutableMapOf<String, Room>()
    private val reservations = mutableMapOf<String, MutableList<TimeSlot>>()

    fun register(room: Room?) {
        require(room != null && room.id.isNotBlank()) { "Room must have an id" }
        rooms[room.id] = room
    }

    fun reserve(roomId: String, timeSlot: TimeSlot) {
        check(rooms.containsKey(roomId)) { "Room not found: $roomId" }
        reservations.getOrPut(roomId) { mutableListOf() }.add(timeSlot)
    }

    fun isAvailable(roomId: String, timeSlot: TimeSlot): Boolean {
        if (!rooms.containsKey(roomId)) return false
        val list = reservations[roomId].orEmpty()
        return list.none { isTimeSlotsOverlapping(timeSlot, it) }
    }

    private val startingTimePattern: Pattern =
        Pattern.compile("""^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}) (CET|CEST|UTC)$""")

    private fun parseStartingTimeMs(startingTime: String): Long {
        val m = startingTimePattern.matcher(startingTime)
        require(m.matches()) { "Invalid startingTime: $startingTime" }
        val ymd = m.group(1)
        val hh = m.group(2)
        val mm = m.group(3)
        val tz = m.group(4)
        val offsetStr = when (tz) {
            "CET" -> "+01:00"
            "CEST" -> "+02:00"
            else -> "Z"
        }
        val text = "${ymd}T${hh}:${mm}:00$offsetStr"
        val zdt = ZonedDateTime.parse(text, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
        return zdt.toInstant().toEpochMilli()
    }

    private fun slotIntervalMs(slot: TimeSlot): Pair<Long, Long> {
        val startMs = parseStartingTimeMs(slot.startingTime)
        val durationMs = slot.duration * 1000L * 60L
        return startMs to (startMs + durationMs)
    }

    private fun isTimeSlotsOverlapping(a: TimeSlot, b: TimeSlot): Boolean {
        val (a0, a1) = slotIntervalMs(a)
        val (b0, b1) = slotIntervalMs(b)
        return !(a0 >= b1 || a1 <= b0)
    }
}

val roomRegistry = RoomRegistry()
