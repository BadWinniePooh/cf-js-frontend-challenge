using System.Globalization;
using System.Text.RegularExpressions;

namespace FindingSeams.RoomAvailability;

public class RoomRegistry
{
    private readonly Dictionary<string, Room> _rooms = new();
    private readonly Dictionary<string, List<TimeSlot>> _reservations = new();

    private static readonly Regex StartingTimePattern = new(
        @"^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}) (CET|CEST|UTC)$",
        RegexOptions.Compiled);

    public void Register(Room? room)
    {
        if (room is null || string.IsNullOrWhiteSpace(room.Id))
            throw new ArgumentException("Room must have an id");

        _rooms[room.Id] = room;
    }

    public void Reserve(string roomId, TimeSlot timeSlot)
    {
        if (!_rooms.ContainsKey(roomId))
            throw new InvalidOperationException($"Room not found: {roomId}");

        if (!_reservations.TryGetValue(roomId, out var list))
        {
            list = new List<TimeSlot>();
            _reservations[roomId] = list;
        }

        list.Add(timeSlot);
    }

    public bool IsAvailable(string roomId, TimeSlot timeSlot)
    {
        if (!_rooms.ContainsKey(roomId))
            return false;

        var list = _reservations.GetValueOrDefault(roomId) ?? new List<TimeSlot>();
        return !list.Any(r => IsTimeSlotsOverlapping(timeSlot, r));
    }

    private static long ParseStartingTimeMs(string startingTime)
    {
        var m = StartingTimePattern.Match(startingTime);
        if (!m.Success)
            throw new ArgumentException($"Invalid startingTime: {startingTime}");

        var ymd = m.Groups[1].Value;
        var hh = m.Groups[2].Value;
        var mm = m.Groups[3].Value;
        var tz = m.Groups[4].Value;
        var offset = tz switch
        {
            "CET" => TimeSpan.FromHours(1),
            "CEST" => TimeSpan.FromHours(2),
            _ => TimeSpan.Zero,
        };

        var local = DateTime.ParseExact($"{ymd}T{hh}:{mm}:00", "yyyy-MM-dd'T'HH:mm:ss",
            CultureInfo.InvariantCulture, DateTimeStyles.None);
        return new DateTimeOffset(local, offset).ToUnixTimeMilliseconds();
    }

    private static (long StartMs, long EndMs) SlotIntervalMs(TimeSlot slot)
    {
        var startMs = ParseStartingTimeMs(slot.StartingTime);
        var durationMs = slot.Duration * 1000L * 60L;
        return (startMs, startMs + durationMs);
    }

    private static bool IsTimeSlotsOverlapping(TimeSlot a, TimeSlot b)
    {
        var (a0, a1) = SlotIntervalMs(a);
        var (b0, b1) = SlotIntervalMs(b);
        return !(a0 >= b1 || a1 <= b0);
    }
}

public static class RoomRegistries
{
    public static readonly RoomRegistry Instance = new();
}
