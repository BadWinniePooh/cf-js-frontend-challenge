namespace FindingSeams.RoomAvailability;

public record PlaceSessionResult(
    int SessionId,
    string RoomId,
    TimeSlot TimeSlot,
    string Status,
    string? Reason = null);

public class RoomService
{
    public PlaceSessionResult PlaceSessionInRoom(int sessionId, string roomId, TimeSlot timeSlot)
    {
        if (!RoomRegistries.Instance.IsAvailable(roomId, timeSlot))
        {
            return new PlaceSessionResult(sessionId, roomId, timeSlot, "REJECTED", "Room not available");
        }

        RoomRegistries.Instance.Reserve(roomId, timeSlot);
        return new PlaceSessionResult(sessionId, roomId, timeSlot, "ACCEPTED");
    }
}
