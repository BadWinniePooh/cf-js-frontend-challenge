namespace FindingSeams.BadgePrinting;

public static class BadgeSequence
{
    private static int _sequenceNumber;

    public static int NextId()
    {
        _sequenceNumber++;
        return _sequenceNumber;
    }
}
