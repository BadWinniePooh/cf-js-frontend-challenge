namespace FindingSeams.SpeakerFeedback;

public class FeedbackSensor
{
    public List<int>? ReadScores()
    {
        var outcome = Random.Shared.NextDouble();

        if (outcome < 0.05)
            throw new InvalidOperationException("Sensor failure");

        if (outcome < 0.1)
            return null;

        var length = 1 + (int)(Random.Shared.NextDouble() * 5);
        var scores = new List<int>(length);
        for (var i = 0; i < length; i++)
            scores.Add(1 + (int)(Random.Shared.NextDouble() * 5));

        return scores;
    }
}
