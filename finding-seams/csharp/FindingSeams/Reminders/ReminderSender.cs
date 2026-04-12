using System.Globalization;

namespace FindingSeams.Reminders;

public class ReminderSender
{
    private readonly int _retryCount = 3;

    public async Task SendAllAsync(IReadOnlyList<Reminder> reminders)
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        foreach (var reminder in reminders)
        {
            var sendAt = ToTimestamp(reminder.SendAt);
            if (sendAt <= now)
                await RetryReminderSendingAsync(reminder).ConfigureAwait(false);
        }
    }

    private async Task RetryReminderSendingAsync(Reminder reminder)
    {
        var currentCount = 0;
        while (true)
        {
            try
            {
                await SendsReminders.Instance.SendAsync(reminder).ConfigureAwait(false);
                return;
            }
            catch
            {
                Console.WriteLine("Error sending reminder:  Retrying...");
            }

            var cond = currentCount < _retryCount;
            currentCount++;
            if (!cond)
                break;
        }
    }

    private static long ToTimestamp(object? value) =>
        value switch
        {
            null => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            DateTimeOffset dto => dto.ToUnixTimeMilliseconds(),
            DateTime dt => new DateTimeOffset(dt).ToUnixTimeMilliseconds(),
            long l => l,
            int i => i,
            string s when s.All(char.IsDigit) => long.Parse(s, CultureInfo.InvariantCulture),
            string s when DateTimeOffset.TryParse(s, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind,
                out var p) => p.ToUnixTimeMilliseconds(),
            _ => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
        };
}
