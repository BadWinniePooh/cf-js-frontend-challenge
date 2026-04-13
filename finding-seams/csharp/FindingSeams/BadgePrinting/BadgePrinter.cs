namespace FindingSeams.BadgePrinting;

public class BadgePrinter(
    object? printerDrivers = null,
    object? printerConfigs = null,
    object? badgeDimensionResolvers = null,
    object? printerFactory = null)
{
    public Badge CreateBadge(string name, string pronouns)
    {
        var issuedAt = DateTimeOffset.Now;
        var id = BadgeSequence.NextId();
        var formattedId = $"CONF-{id}";
        return new Badge(formattedId, name, pronouns, issuedAt);
    }

    public void PrintBadge(Badge badge)
    {
        dynamic resolvers = badgeDimensionResolvers!;
        dynamic configs = printerConfigs!;
        dynamic drivers = printerDrivers!;
        dynamic factory = printerFactory!;
        dynamic dimensions = resolvers.Resolve(badge);
        dynamic config = configs.GetConfigBasedOnDimensions(dimensions);
        dynamic driver = drivers.Get("BadgePrinting");
        dynamic printer = factory.Load(driver, config);
        printer.Print(badge);
    }
}
