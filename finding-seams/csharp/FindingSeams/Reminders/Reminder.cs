namespace FindingSeams.Reminders;

public record Reminder(string Id, string Email, object? SendAt = null);
