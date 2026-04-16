using FindingSeams.SpeakerFeedback;
using Xunit;

namespace FindingSeams.Tests;

public class SpeakerFeedbackTest
{
    [Fact(Skip = "Exercise: finding seams — enable when working on speaker feedback")]
    public void Calculates_average_score()
    {
        var speakerFeedback = new SpeakerFeedbackService();

        var result = speakerFeedback.EvaluateSpeaker();

        Assert.Equal(new EvaluateSpeakerResult("OK", 3.6), result);
    }
}
