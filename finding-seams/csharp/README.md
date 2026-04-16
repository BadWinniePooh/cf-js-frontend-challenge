# Finding seams — C#

Same exercises as the [parent README](../README.md). Library **`FindingSeams`** targets **.NET 8**; tests use **xUnit** in **`FindingSeams.Tests`**.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download) (or newer, if you re-target the projects)

## Setup & tests

From `02-finding-seams/csharp/`:

```bash
dotnet restore
dotnet test
```

Run a single test class:

```bash
dotnet test --filter FullyQualifiedName~ReminderSenderTest
```

Most exercise tests use **`[Fact(Skip = "...")]`**; **`ReminderSenderTest`** stays enabled. It awaits `SendAllAsync` with **`.WaitAsync(TimeSpan.FromSeconds(2))`**, matching **Mocha’s default 2000 ms** (and Python’s `asyncio.wait_for` / Kotlin’s `withTimeout(2000)`), so slow sleeps and retries often cause **`TimeoutException`** until participants introduce seams.

## Solution layout

| Test file | Area |
|-----------|------|
| `FindingSeams.Tests/SpeakerFeedbackTest.cs` | Speaker feedback |
| `FindingSeams.Tests/BadgePrinterTest.cs` | Badge printing |
| `FindingSeams.Tests/RoomAvailabilityTest.cs` | Room availability |
| `FindingSeams.Tests/ScheduleToTextTest.cs` | Schedule → text |
| `FindingSeams.Tests/ReminderSenderTest.cs` | Reminder sender |

Schedule JSON is copied next to the main library under `FindingSeams/Resources/schedule/` and also into the test output via the test project file so `ConvertToText` can resolve files at runtime.

## Note on namespaces

Reminder code lives under **`FindingSeams.Reminders`** so the type name **`ReminderSender`** does not clash with a namespace name.
