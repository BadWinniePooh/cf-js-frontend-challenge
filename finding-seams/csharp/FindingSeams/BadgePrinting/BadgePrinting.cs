namespace FindingSeams.BadgePrinting;

public class BadgePrinting
{
    private readonly object? _printerDrivers;
    private readonly object? _printerConfigs;
    private readonly object? _badgeDimensionResolvers;
    private readonly object? _printerFactory;

    public BadgePrinting(
        object? printerDrivers = null,
        object? printerConfigs = null,
        object? badgeDimensionResolvers = null,
        object? printerFactory = null)
    {
        _printerDrivers = printerDrivers;
        _printerConfigs = printerConfigs;
        _badgeDimensionResolvers = badgeDimensionResolvers;
        _printerFactory = printerFactory;
    }

    public Badge CreateBadge(string name, string pronouns)
    {
        var issuedAt = DateTimeOffset.Now;
        var id = BadgeSequence.NextId();
        var formattedId = $"CONF-{id}";
        return new Badge(formattedId, name, pronouns, issuedAt);
    }

    public void PrintBadge(Badge badge)
    {
        dynamic resolvers = _badgeDimensionResolvers!;
        dynamic configs = _printerConfigs!;
        dynamic drivers = _printerDrivers!;
        dynamic factory = _printerFactory!;
        dynamic dimensions = resolvers.Resolve(badge);
        dynamic config = configs.GetConfigBasedOnDimensions(dimensions);
        dynamic driver = drivers.Get("BadgePrinting");
        dynamic printer = factory.Load(driver, config);
        printer.Print(badge);
    }
}
