namespace FindingSeams.SpeakerFeedback;

public record EvaluateSpeakerResult(string Status, double? AverageScore);

public class SpeakerFeedbackService
{
    private readonly FeedbackSensor _sensor = new();
    private readonly double _alertThreshold = 2.2;

    public EvaluateSpeakerResult EvaluateSpeaker()
    {
        var scores = _sensor.ReadScores();

        if (scores is null || scores.Count == 0)
            return new EvaluateSpeakerResult("ALERT", null);

        var validScores = scores.Where(s => s is >= 1 and <= 5).ToList();
        if (validScores.Count == 0)
            return new EvaluateSpeakerResult("ALERT", null);

        var average = validScores.Sum() / (double)validScores.Count;
        if (average < _alertThreshold)
            return new EvaluateSpeakerResult("ALERT", average);

        return new EvaluateSpeakerResult("OK", average);
    }
}
