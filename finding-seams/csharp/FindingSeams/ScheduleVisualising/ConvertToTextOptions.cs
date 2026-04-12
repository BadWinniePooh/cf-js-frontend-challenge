namespace FindingSeams.ScheduleVisualising;

public class ConvertToTextOptions
{
    public string Timezone { get; set; } = "UTC";
    public string? Locale { get; set; }
    public string Track { get; set; } = "all";
    public bool? IncludeBreaks { get; set; }
    public IReadOnlyList<string>? Types { get; set; }
}
