using System.Globalization;
using System.Text.Json;

namespace FindingSeams.ScheduleVisualising;

public class ScheduleToText
{
    private static readonly DateTimeOffset ConferenceStart =
        DateTimeOffset.Parse("2025-11-03T00:00:00Z", CultureInfo.InvariantCulture);

    private const int ConferenceDurationDays = 3;
    private static readonly long MsPerDay = 1000L * 60 * 60 * 24;

    private static readonly Dictionary<string, int> TimezoneOffsets = new()
    {
        ["UTC"] = 0,
        ["Europe/Helsinki"] = 120,
        ["Europe/Stockholm"] = 60,
        ["Europe/London"] = 0,
        ["America/New_York"] = -300,
        ["America/Chicago"] = -360,
        ["America/Los_Angeles"] = -480,
    };

    private static readonly HashSet<string> SupportedLocales =
        new(StringComparer.Ordinal) { "en-US", "en-GB", "fi-FI", "sv-SE", "de-DE" };

    private readonly ScheduleFormatter _formatter = new();

    public async Task<string> ConvertToText(object dateInput, ConvertToTextOptions? options = null)
    {
        options ??= new ConvertToTextOptions();

        var requested = CoerceDate(dateInput);
        if (requested is null)
            return "Invalid date provided.\n";

        var dayIndex = (int)((requested.Value.ToUnixTimeMilliseconds() - ConferenceStart.ToUnixTimeMilliseconds()) /
                             MsPerDay);
        if (dayIndex < 0 || dayIndex >= ConferenceDurationDays)
        {
            var human = requested.Value.ToString("R", CultureInfo.InvariantCulture);
            return $"No schedule available for {human}.\n";
        }

        var conferenceDay = dayIndex + 1;
        var dateString = ToDateString(requested.Value);

        var tzName = options.Timezone;
        var timezoneOffset = TimezoneOffsets.GetValueOrDefault(tzName, 0);
        var locale = options.Locale is { } loc && SupportedLocales.Contains(loc) ? loc : "en-US";
        var track = options.Track;
        var includeBreaks = options.IncludeBreaks is not false;
        var allowedTypes = options.Types ?? new[] { "talk", "workshop", "break" };

        var path = Path.Combine(AppContext.BaseDirectory, "Resources", "schedule", $"schedule-{dateString}.json");
        if (!File.Exists(path))
            return "Invalid date provided.\n";

        var raw = await File.ReadAllTextAsync(path);
        using var doc = JsonDocument.Parse(raw);
        var root = doc.RootElement;
        var sessions = new List<ScheduleSession>();
        if (root.TryGetProperty("sessions", out var arr))
        {
            foreach (var el in arr.EnumerateArray())
                sessions.Add(ParseSession(el));
        }

        if (track != "all")
            sessions = sessions.Where(s => s.Track == track || s.Track == "all").ToList();

        if (!includeBreaks)
            sessions = sessions.Where(s => s.Type != "break").ToList();

        sessions = sessions.Where(s => s.Type is { } t && allowedTypes.Contains(t)).ToList();

        var formattingOptions = new ScheduleFormatOptions(
            Locale: locale,
            TimezoneOffset: timezoneOffset,
            ConferenceDay: conferenceDay,
            Timezone: tzName);

        return _formatter.Format(new ScheduleObject(sessions), formattingOptions);
    }

    private static DateTimeOffset? CoerceDate(object dateInput) =>
        dateInput switch
        {
            DateTimeOffset dto => dto,
            DateTime dt => new DateTimeOffset(dt),
            long l => DateTimeOffset.FromUnixTimeMilliseconds(l),
            int i => DateTimeOffset.FromUnixTimeMilliseconds(i),
            uint ui => DateTimeOffset.FromUnixTimeMilliseconds(ui),
            string s when s.All(char.IsDigit) => DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(s)),
            string s => DateTimeOffset.TryParse(s, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var p)
                ? p
                : null,
            _ => null,
        };

    private static string ToDateString(DateTimeOffset instant)
    {
        var u = instant.ToOffset(TimeSpan.Zero);
        return $"{u.Year:D4}-{u.Month:D2}-{u.Day:D2}";
    }

    private static ScheduleSession ParseSession(JsonElement o)
    {
        string? Str(string name) => o.TryGetProperty(name, out var p) && p.ValueKind != JsonValueKind.Null
            ? p.GetString()
            : null;

        int? Len = o.TryGetProperty("length", out var lp) && lp.ValueKind != JsonValueKind.Null
            ? lp.GetInt32()
            : null;

        return new ScheduleSession(Str("start"), Len, Str("title"), Str("speaker"), Str("room"), Str("track"),
            Str("type"));
    }
}
