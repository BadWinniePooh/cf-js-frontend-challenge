namespace FindingSeams.Reminders;

public sealed class SendsReminders
{
    public static readonly SendsReminders Instance = new();

    public async Task SendAsync(Reminder reminder)
    {
        Console.WriteLine($"Sending reminder {reminder.Id} to {reminder.Email}");
        await Task.Delay(1100);
        if (Random.Shared.NextDouble() < 0.40)
            throw new InvalidOperationException("Failed to send reminder");
    }
}
