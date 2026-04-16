# Finding seams — Kotlin

Same exercises as the [parent README](../README.md). Sources live under `src/main/kotlin/findingseams/`; tests use **JUnit 5** and **kotlin.test** under `src/test/kotlin/findingseams/`.

## Prerequisites

- **JDK** installed and discoverable (Gradle / `./gradlew` need a Java runtime; **JDK 17+** recommended).
- **Gradle**: use the included **`./gradlew`** in this directory (wrapper JAR is committed). Alternatively use a local **`gradle`** on your `PATH`.

## Setup & tests

From `02-finding-seams/kotlin/`:

```bash
./gradlew test
# or, if you do not have the wrapper yet:
gradle test
```

Run a single test class:

```bash
./gradlew test --tests findingseams.ReminderSenderTest
```

Most exercise tests are **`@Disabled`**; leave **`ReminderSenderTest`** enabled. It wraps `sendAll` in **`withTimeout(2000)`** (same idea as **Mocha’s default 2000 ms** and Python’s `asyncio.wait_for(..., 2.0)`), so slow sleeps and retries often cause **`TimeoutCancellationException`** until participants introduce seams.

## Layout

| Test class | Area |
|------------|------|
| `SpeakerFeedbackTest` | Speaker feedback |
| `BadgePrinterTest` | Badge printing |
| `RoomAvailabilityTest` | Room availability |
| `ScheduleToTextTest` | Schedule → text |
| `ReminderSenderTest` | Reminder sender |

Schedule JSON files are under `src/main/resources/schedule/`.

## Dependencies (main)

- **kotlinx-coroutines** — async reminder sending and `ScheduleToText.convertToText`
- **Gson** — JSON schedule files
