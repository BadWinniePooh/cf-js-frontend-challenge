using FindingSeams.ScheduleVisualising;
using Xunit;

namespace FindingSeams.Tests;

public class ScheduleToTextTest
{
    [Fact(Skip = "Exercise: finding seams — enable when working on schedule to text")]
    public async Task Prints_as_markdown()
    {
        var scheduleConverter = new ScheduleToText();
        var tsMs = DateTimeOffset.Parse("2025-11-03T00:00:00Z").ToUnixTimeMilliseconds();

        var result = await scheduleConverter.ConvertToText(
            tsMs,
            new ConvertToTextOptions { IncludeBreaks = false });

        Assert.Equal(
            """
            # Conference Schedule \u2013 Day 1 (UTC)

            * 09:00\u201310:00 Example Keynote \u2013 (Unknown Speaker) @ Main Hall [talk]
            * 10:00\u201311:30 Example workshop \u2013 (Unknown Speaker) @ TBD room [workshop]
            """ + "\n",
            result);
    }
}
