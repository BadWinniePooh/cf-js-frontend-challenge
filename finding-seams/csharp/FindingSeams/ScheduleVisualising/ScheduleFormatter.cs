namespace FindingSeams.ScheduleVisualising;

public record ScheduleSession(
    string? Start,
    int? Length,
    string? Title,
    string? Speaker,
    string? Room,
    string? Track,
    string? Type);

public record ScheduleObject(IReadOnlyList<ScheduleSession> Sessions);

public record ScheduleFormatOptions(
    string Locale = "en-US",
    int TimezoneOffset = 0,
    int? ConferenceDay = null,
    string Timezone = "UTC");

public class ScheduleFormatter
{
    public string Format(ScheduleObject? scheduleObject, ScheduleFormatOptions? options = null)
    {
        var o = options ?? new ScheduleFormatOptions();
        _ = o.Locale;

        if (scheduleObject is null)
            return "No sessions available.\n";

        var sorted = scheduleObject.Sessions.ToList();
        sorted.Sort((a, b) =>
        {
            if (string.IsNullOrEmpty(a.Start) && string.IsNullOrEmpty(b.Start)) return 0;
            if (string.IsNullOrEmpty(a.Start)) return 1;
            if (string.IsNullOrEmpty(b.Start)) return -1;
            return string.Compare(a.Start, b.Start, StringComparison.Ordinal);
        });

        var dayLabel = o.ConferenceDay is { } d ? $"Day {d}" : "Conference";
        var tzLabel = o.TimezoneOffset == 0 ? "UTC" : o.Timezone;

        var sb = new System.Text.StringBuilder();
        sb.Append("# Conference Schedule \u2013 ").Append(dayLabel).Append(" (").Append(tzLabel).Append(")\n\n");

        foreach (var session in sorted)
        {
            var title = session.Title ?? "Untitled Session";
            var speaker = session.Speaker is { } sp ? $" \u2013 {sp}" : "";
            var room = session.Room ?? "TBD";
            var displayStart = ShiftTime(session.Start ?? "??:??", o.TimezoneOffset);
            var displayEnd = session.Length is { } len
                ? ShiftTime(AddMinutes(session.Start ?? "00:00", len), o.TimezoneOffset)
                : null;
            var timeRange = displayEnd is { } de ? $"{displayStart}\u2013{de}" : displayStart;
            var typeTag = session.Type is { } ty ? $" [{ty}]" : "";
            sb.Append("* ").Append(timeRange).Append(' ').Append(title).Append(speaker)
                .Append(" @ ").Append(room).Append(typeTag).Append('\n');
        }

        return sb.ToString();
    }

    private static string ShiftTime(string timeStr, int offsetMinutes)
    {
        if (string.IsNullOrEmpty(timeStr) || timeStr.Contains('?', StringComparison.Ordinal))
            return timeStr;

        var parts = timeStr.Split(':');
        var h = parts.Length > 0 ? int.Parse(parts[0]) : 0;
        var m = parts.Length > 1 ? int.Parse(parts[1]) : 0;
        var totalMinutes = h * 60 + m + offsetMinutes;
        var normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
        var adjH = normalized / 60;
        var adjM = normalized % 60;
        return $"{adjH:D2}:{adjM:D2}";
    }

    private static string AddMinutes(string timeStr, int minutes)
    {
        var parts = timeStr.Split(':');
        var h = parts.Length > 0 ? int.Parse(parts[0]) : 0;
        var m = parts.Length > 1 ? int.Parse(parts[1]) : 0;
        var total = h * 60 + m + minutes;
        var endH = (total / 60) % 24;
        var endM = total % 60;
        return $"{endH:D2}:{endM:D2}";
    }
}
