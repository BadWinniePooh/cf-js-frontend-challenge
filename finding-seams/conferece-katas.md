## Conference Katas – Planning Notes

This file describes a set of small “legacy-style” katas in a conference-organizing domain.

---

## 1. `speaker-feedback/`

A small kata with an **unreliable external collaborator** that returns random values.

### Story

You get anonymous feedback from a device / service after each talk.
The device is unreliable: sometimes it returns sensible scores, sometimes junk, sometimes nothing.

The Service returs 2 possible status: ALERT or 'OK' 
 - ALERT if the average score is less than 2.2
 - OK otherwise

The changing requirement is to add 3rd possible status, 'BOOK_AGAIN', this happens if
 - BOOK_AGAIN if average score is 4.2 or more.

### Current Implementation Detils

- `feedback-sensor.js`
  - Simulates an external service.
  - Returns:
    - a Random number of integers from 1–5 (reasonable score).
    - Throws errors or returns null to simulate network/device failure.

- `speaker-feedback.js`
  - Calls `feedback-sensor` to get a score.
  - Contains logic like:
    - If score is invalid or error occurs, return status 'ALERT' with averageScore null
    - Calculates the average
    - If the final score is below a threshold, it marks the speaker as “ALERT”.
    - If the final score is below another threshold, marks the speaker as "book for next year"

### Intended Pain Points / Challenges

- **Randomness**:
  - `feedback-sensor` makes tests flaky unless it’s faked or stubbed.
- **Tight coupling**:
  - `speaker-feedback` calls the real sensor directly instead of via an interface.

### Refactoring / TDD Goals

- Introduce a way to **replace** `feedback-sensor` in tests (dependency injection or similar).
- Extract either
  - a **pure decision function**:
    - Input: a score (or sequence of scores / events).
    - Output: should we “ALERT” or “OK”?
  - a **something** that takes the shape of a sensor as parameter.
    - Input: **something**
    - Output: should we "ALERT" or "OK"?
---

## 2. `badge-printer/`

A kata centered around a **shared / singleton-style** sequence generator.

### Story

When attendees register, they receive a **badge ID**.
All registration desks must request the **next badge ID** from one shared source, or you’ll get duplicates.

### Initial Files (idea)

- `badge-printing.js`
  - The main entry point for the capability.
  - Uses `badge-id-generation` to create a new Id for the `badge` instance.
- `badge-id-generation.js`
  - Holds a counter in module-level / global state.
  - Exposes `nextId()` that increments and returns the next integer.
- `badge.js`
  - Represents a badge with its ID and name and pronouns.

### Intended Pain Points / Challenges

- **Global state**:
  - The `badge-id-generation` is effectively a singleton.
  - Tests that use it can interfere with each other (order dependence).
- **Hard-to-reset sequence**:
  - No clean way to reset the counter between tests.
- **Coupling**:
  - `badge-printing` cannot easily work with a different source of IDs.
- **Connascence of Identity**
  - singletons do introduce Connascence of Identity 
  
### Refactoring / TDD Goals

- Make the sequence **replaceable or resettable**:
  - E.g. inject a “sequence provider” into `badge-dispenser`.
- Separate **ID generation** from **ID formatting**.
- Ensure tests can run in any order without sharing unwanted state.

---

## 3. `schedule-converter/`

A kata based on **reading JSON from a file** and converting it to a readable schedule.

### Story

The conference schedule is stored as a **JSON file** (sessions, speakers, rooms, times).
You need to convert it into a **human-readable program** (HTML, Markdown, or plain text) that you can send out or print.

### Initial Files (idea)

- `schedule-converter.js`
  - Reads a JSON file from disk (path may be hard-coded).
  - Parses it and turns it into a formatted schedule.
  - Does several things at once:
    - File I/O.
    - JSON parsing.
    - Sorting, grouping, or reordering sessions.
    - String formatting / layout for output.
- (Optional) `schedule-formatter.js`
  - Contains messy string concatenation logic for rendering the schedule.

### Intended Pain Points / Challenges

- **File I/O everywhere**:
  - Logic is tightly coupled to reading from disk.
  - Hard to test behavior without touching the filesystem.
- **Mixed responsibilities**:
  - Business rules, parsing, and formatting all live in one place.
- **Weak validation**:
  - Missing or malformed fields in the JSON may produce confusing output or crashes.

### Refactoring / TDD Goals

- Extract a **pure function**:
  - Input: a JavaScript object representing the schedule.
  - Output: a string (HTML / Markdown / text).
- Wrap file reading and JSON parsing into a thin, testable shell.
- Make **rules explicit**:
  - E.g. how to sort sessions, how to group by track, how to handle missing data.

---

## 4. `room-availability/`

A kata about **global/singleton state** that tracks room usage.

### Story

You maintain a list of **rooms** (names, capacities).
Different parts of the system reserve rooms for sessions by updating a **shared room map**.

You want to ask “is this room free at this time?” and “reserve this room”, but everything hangs off a single global object.

### Initial Files (idea)

- `room-registry.js`
  - Exposes a singleton-like object with:
    - `register(room)` – add a room.
    - `reserve(roomId, timeSlot)` – mark a room as reserved.
    - `isAvailable(roomId, timeSlot)` – returns a boolean.
  - Stores all state in module-level variables.
- `room-service.js`
  - Uses `room-registry` directly to:
    - Decide if a session can be placed in a room.
    - Reserve the room if it is free.

### Intended Pain Points / Challenges

- **Singleton / global variables**:
  - The registry keeps process-wide state that leaks between tests.
- **No seam**:
  - Callers cannot swap out the registry for a fake.
- **Hidden coupling**:
  - Tests need “just the right” existing state in the registry to be meaningful.

### Refactoring / TDD Goals

- Introduce a **room store interface** that can be implemented by:
  - The current global registry.
  - A simple in-memory fake for tests.
- Allow `room-service` to receive its registry/store as a dependency.
- Make it possible to test scenarios **without sharing global state** between tests.

---

## 5. `speaker-profile-service/`

A kata where an object is **constructed directly inside the logic**, not injected.

### Story

You have a service that fetches **speaker profiles** from a backend API.
The service internally creates an HTTP client (or repository object) right in the middle of a method.

You want to test the logic for selecting and combining profile data, but the hard-wired client makes that difficult.

### Initial Files (idea)

- `speaker-api-client.js`
  - Wraps HTTP calls (or simulates them).
  - Methods like:
    - `fetchSpeakerById(id)`
    - `fetchTalksBySpeaker(id)`
- `speaker-profile-service.js`
  - Has a method like `buildProfile(speakerId)` that:
    - Creates a new `SpeakerApiClient()` inside the method or constructor.
    - Calls multiple client methods.
    - Applies some rules to merge data:
      - Picks primary talk.
      - Computes a “popularity” score.
      - Filters out cancelled talks.
  - The `new SpeakerApiClient()` call is **in the middle of the logic**, not at the edges.

### Intended Pain Points / Challenges

- **No injection**:
  - The API client is always the real one, created with `new`.
- **Hard to fake**:
  - Tests must talk to a real or semi-real API client.
- **Hidden side effects**:
  - The object creation may trigger configuration, network calls, or logging.

### Refactoring / TDD Goals

- Introduce a **creation seam**:
  - E.g. a factory function or parameter that provides the API client.
- Allow tests to pass in a **fake client** that returns controlled data.
- Extract a pure function that:
  - Input: raw speaker and talk data.
  - Output: the combined profile object.

---

## 6. `reminder-sender/`

A kata that is hard to test because it depends on **timing** and a function that actually sleeps.

### Story

Before the conference, you send **email reminders** to attendees a few days before their talks or workshops.
The legacy implementation waits between sending reminders using a real sleep, which makes tests slow and brittle.

### Initial Files (idea)

- `delay.js`
  - Exposes a function like `sleep(ms)` that:
    - Uses `setTimeout` or another mechanism to really wait for the given time.
- `reminder-sender.js`
  - Has a method like `sendAll(reminders)` that:
    - Loops over a list of reminder objects.
    - For each reminder:
      - Calls `sendEmail(reminder)` (could be another module).
      - Calls `sleep(1000)` from `delay.js` between sends to throttle them.
    - Maybe also decides whether a reminder is “due” based on current time.

### Intended Pain Points / Challenges

- **Real sleep in tests**:
  - Tests that call `sendAll` become slow and sometimes flaky.
- **Direct time usage**:
  - Logic may call `Date.now()` or `new Date()` directly, mixing business rules with the current clock.
- **No seam around timing**:
  - There is no way to override the sleep or the clock during tests.
- **Hidden rules**:
  - Thresholds and retry counts are hard-coded in the logic.

### Refactoring / TDD Goals

- Wrap timing concerns behind interfaces:
  - A `delay` dependency that can be **replaced by a fake** which doesn’t really sleep.
  - A `clock` dependency to provide “current time”.
- Separate:
  - “Which reminders should be sent now?” (pure function).
  - “Actually send and delay between them.” (orchestrating logic).
- Enable **fast, deterministic tests** without real waiting.

- Make logic around “invalid data” and “retries” explicit and testable.

---

## How You Might Use These

- Start with “legacy” implementations that:
  - Use randomness directly.
  - Hide state in singletons.
  - Mix I/O and logic.
- Add tests around current behavior, then refactor using:
  - Fakes / stubs for the random collaborator.
  - Dependency injection for the badge sequence.
  - Pure transformation functions for schedule formatting.

You can rename folders and files as you like to better match your style and then implement each kata in its own directory, similar to the existing ones in this repo.