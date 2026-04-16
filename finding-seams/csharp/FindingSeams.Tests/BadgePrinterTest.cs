using FindingSeams.BadgePrinting;
using Xunit;

namespace FindingSeams.Tests;

public class BadgePrinterTest
{
    [Fact(Skip = "Exercise: finding seams — enable when working on badge printing")]
    public void Prints_a_badge()
    {
        var badgeDispenser = new BadgePrinter();

        var badge = badgeDispenser.CreateBadge("Test person", "they/them");

        Assert.Equal("CONF-1", badge.Id);
        Assert.Equal("Test person", badge.Name);
        Assert.Equal("they/them", badge.Pronouns);
    }

    [Fact(Skip = "Exercise: finding seams — enable when working on badge printing")]
    public void Prints_second_badge()
    {
        var badgeDispenser = new BadgePrinter();

        var badge = badgeDispenser.CreateBadge("Test person", "they/them");

        Assert.Equal("CONF-2", badge.Id);
        Assert.Equal("Test person", badge.Name);
        Assert.Equal("they/them", badge.Pronouns);
    }
}
