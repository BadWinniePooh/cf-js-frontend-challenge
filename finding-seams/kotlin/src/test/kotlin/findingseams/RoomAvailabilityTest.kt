package findingseams

import findingseams.roomavailability.PlaceSessionResult
import findingseams.roomavailability.Room
import findingseams.roomavailability.RoomService
import findingseams.roomavailability.TimeSlot
import findingseams.roomavailability.roomRegistry
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs

@Disabled("Exercise: finding seams — enable when working on room availability")
class RoomAvailabilityTest {
    private val exampleTimeslot = TimeSlot("2026-01-11T10:00 CET", 60)

    @Test
    fun `assigns room`() {
        roomRegistry.register(Room("room-1", "Ekin Kammi"))
        val roomService = RoomService()

        val result = roomService.placeSessionInRoom(1, "room-1", exampleTimeslot)

        assertIs<PlaceSessionResult.Accepted>(result)
        assertEquals(1, result.sessionId)
        assertEquals("room-1", result.roomId)
        assertEquals("ACCEPTED", result.status)
        assertEquals(exampleTimeslot, result.timeSlot)
    }

    @Disabled("Exercise: inject a shape with method isAvailable that you can control")
    @Test
    fun `fails to assign room`() {
        val roomService = RoomService()
        val conflictingSlot = TimeSlot("2026-01-11T09:30 CET", 60)

        val result = roomService.placeSessionInRoom(1, "room-1", conflictingSlot)

        assertIs<PlaceSessionResult.Rejected>(result)
        assertEquals(1, result.sessionId)
        assertEquals("room-1", result.roomId)
        assertEquals("REJECTED", result.status)
        assertEquals("Room not available", result.reason)
        assertEquals(conflictingSlot, result.timeSlot)
    }
}
