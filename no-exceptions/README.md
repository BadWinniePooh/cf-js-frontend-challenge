# No Exceptions!

This is code exercise aiming to learn to get rid of exceptional code, that is, code that relies on exception handling.

> **Before you start:** make sure the project runs — see [getting-started.md](./getting-started.md).

## Learning outcome!

Demonstrate how to turn code that relies heavily on exceptions into code where exceptions are rarity - and only for real
programming errors

## Warmup

First things first, make a branch in the repo, only for you!

Before we touch any code, let's connect to what we already know about exceptions.
Write your answers in [learning-log.md](./learning-log.md).

1. **Solo, ~1 min:** List 5 reasons developers throw exceptions in code. Quantity over quality — just get them down.
2. **Solo, ~2 min:** Write down 1 time an exception caused you pain — a bug, a bad debug session, a surprise in production, a confusing stack trace, anything.
3. **In pairs, ~3 min:** Compare your lists. Find one pattern.
4. **Whole room, ~2 min:** Each pair shares their pattern in one sentence.

---

## Concepts — Make sense of what you're looking at

Before changing the code, let's share vocabulary for what's already there.
For each concept below: read the short explanation, look at the linked code, then **in pairs, ~1 min**, summarize it in your own words.

### Acceptance test — the outside-in contract

[`javascript/test/acceptance.test.js`](./javascript/test/acceptance.test.js) describes the contract of the signup capability from the *outside*: real `SessionRepository`, real `UserRepository`, real `Session` — only the inputs and the observable effects are checked. If we change the implementation, the acceptance test should still hold (unless we are explicitly changing the contract).

The incoming boundary of the capability is [`signup-to-session.js`](./javascript/src/attend-to-a-session/routes/signup-to-session.js). The calling code today expects that it will throw when not on the happy path — that is part of the contract we are about to change.

**In pairs, ~1 min:** What is the difference between this acceptance test and the unit test for `SignupHandler`? Tell your pair.

### Builder pattern: `acts.as.session()`

In [`signup-to-session.test.js`](./javascript/test/attend-to-a-session/action/signup-to-session.test.js), look at the helpers at the bottom of the file and how they are used:

```js
session = acts.as.session({ attend: sinon.spy() })
user    = acts.as.user({ id: userId })
```

These are **test builders** — a small fluent API that creates the test double you need, with sensible defaults you can override per test. The intent is readability: `acts.as.session()` reads as a sentence.

**In pairs, ~1 min:** Why "acts" vs "dummy"? What might the difference signal about the role the double is playing in a test?

### Hand-rolled stubs

Inside the same file's `beforeEach`:

```js
sessionRepository = {
  findById: (_) => session,
  save: sinon.spy(),
}
```

No mocking framework — just an object literal. This is a **stub**: it returns canned answers. `save: sinon.spy()` adds a **spy** on top: same idea, but it also records calls so we can assert on them later.

**In pairs, ~1 min:** When is a plain-object stub better than a mocking-framework mock? Any downsides?

### Exceptions as control flow

Look at [`signup-to-session.js`](./javascript/src/attend-to-a-session/routes/signup-to-session.js):

```js
if (!session) {
  throw new Error('Session not found')
}
```

"Session not found" is an *expected* business outcome — there is nothing buggy about looking up a session that does not exist. But the code treats it the same way as a real programmer error: an exception that unwinds the stack. That is **exceptions as control flow**, and it is what this exercise is here to remove.

**In pairs, ~1 min:** Name two places in your own codebase where you have seen exceptions used for expected outcomes. Capture the best one in your learning log.

---

## Concrete Practice — Change the code

### 1. Find the tests that will change

Two `describe` blocks mark behavior that should change. At the end of the exercise, these specific tests should no longer assert that `signUpUserToSession` *throws* — instead they should assert the new return shape. The wording differs slightly between the two files, but the intent is the same:

- **Unit test:** [`javascript/test/attend-to-a-session/action/signup-to-session.test.js`](./javascript/test/attend-to-a-session/action/signup-to-session.test.js) → `describe('This is behavior that we want to change - none of these should throw exceptions', …)`
- **Acceptance test:** [`javascript/test/acceptance.test.js`](./javascript/test/acceptance.test.js) → `describe('when done with the exercise - these do not throw exceptions but the interface is something different', …)`

Open both, read the cases, and check you understand what each is asserting today.

### 2. Decide your approach — in pairs, ~5 min

There are two natural directions:

- **Bottom-up:** start at the domain — [`session.js`](./javascript/src/attend-to-a-session/domain/session.js) — and work outward.
- **Top-down:** start at the incoming boundary — [`signup-to-session.js`](./javascript/src/attend-to-a-session/routes/signup-to-session.js) — and work inward.

Discuss the trade-offs and pick one. **Write your choice and one sentence why in your [learning log](./learning-log.md).**

### 3. Code the change — keep tests green

- Non-marked tests stay green at all times.
- Marked tests can be red only briefly — ideally only the single test you are currently rewriting.
- Commit often. Every commit should leave the rest of the tests green.

### 4. Definition of done

- All tests pass.
- The marked describe blocks have been rewritten so they assert the new return shape (whatever you chose — `null`, a `Result`, a discriminated union, a tuple, …) instead of a thrown exception.
- `signUpUserToSession` throws **only** for real programmer errors. Both expected business outcomes ("user not found", "session not found") *and* expected infrastructure failures ("save failed", "fetch failed") are returned via the result, not thrown.

### Optional stretch goals

Pick one if you have time:

- **Parallel change** (a.k.a. *expand–migrate–contract*): keep the old throwing version working while you build the new one alongside it. No existing test breaks at any point during the migration.
- **Input validation:** `signUpUserToSession` currently trusts its inputs. Add validation for empty / invalid `userId` and `sessionId`, and apply the same "no exceptions for expected outcomes" rule to the validation failures.

---

## Conclusions — Close the loop

Three quick moves to land the learning, ~10 min total.

### 1. Gallery of result shapes — ~5 min

Each pair posts two things (sticky note onsite / shared doc remote):

- The final signature of `signUpUserToSession`
- One line on how the *call site* handles the result

Then everyone walks the gallery / scrolls the doc **silently**. No discussion yet — just look.

When you sit back down, one open question to the room: *"What's something you saw that you didn't think of?"*

### 2. Back to the warmup — ~2 min

Open your [learning log](./learning-log.md). Look at your "5 reasons developers throw exceptions" from the warmup:

- Cross out any you no longer agree with.
- Add a 6th — something you would add now that you could not have written at the start.

### 3. One commitment — ~3 min

In pairs, complete this sentence, write it in your learning log, and share with your pair:

> *"Next time I'm in a code review and I see `throw new Error('… not found')`, I will ____."*



## Finished?

[back to root](../README.md)    