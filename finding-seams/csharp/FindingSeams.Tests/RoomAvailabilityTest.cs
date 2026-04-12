using FindingSeams.RoomAvailability;
using Xunit;

namespace FindingSeams.Tests;

public class RoomAvailabilityTest
{
    private static readonly TimeSlot ExampleTimeslot = new("2026-01-11T10:00 CET", 60);

    [Fact(Skip = "Exercise: finding seams — enable when working on room availability")]
    public void Assigns_room()
    {
        RoomRegistries.Instance.Register(new Room("room-1", "Ekin Kammi"));
        var roomService = new RoomService();

        var result = roomService.PlaceSessionInRoom(1, "room-1", ExampleTimeslot);

        Assert.Equal("ACCEPTED", result.Status);
        Assert.Equal(1, result.SessionId);
        Assert.Equal("room-1", result.RoomId);
        Assert.Equal(ExampleTimeslot, result.TimeSlot);
    }

    [Fact(Skip = "Exercise: inject a shape with method is_available that you can control")]
    public void Fails_to_assign_room()
    {
        var roomService = new RoomService();
        var conflictingSlot = new TimeSlot("2026-01-11T09:30 CET", 60);

        var result = roomService.PlaceSessionInRoom(1, "room-1", conflictingSlot);

        Assert.Equal("REJECTED", result.Status);
        Assert.Equal(1, result.SessionId);
        Assert.Equal("room-1", result.RoomId);
        Assert.Equal("Room not available", result.Reason);
        Assert.Equal(conflictingSlot, result.TimeSlot);
    }
}
