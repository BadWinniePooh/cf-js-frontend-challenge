using FindingSeams.Reminders;
using Xunit;

namespace FindingSeams.Tests;

public class ReminderSenderTest
{
    /// <summary>Same wall-clock pressure as Mocha’s default 2000 ms test timeout.</summary>
    [Fact]
    public async Task Sends_reminders_qyuickly()
    {
        var reminderSender = new ReminderSender();

        await reminderSender.SendAllAsync(new List<Reminder> { new("1", "foo@example.com") })
            .WaitAsync(TimeSpan.FromSeconds(2));
    }
}
