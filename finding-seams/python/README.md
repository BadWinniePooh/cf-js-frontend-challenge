# Finding seams — Python

Same exercises as the [parent README](../README.md), under `src/` with **pytest** in `test/`.

## Prerequisites

- **Python 3.11+** (3.12+ recommended)

## Setup

From this directory (`02-finding-seams/python/`):

```bash
python3 -m venv .venv
.venv/bin/pip install -e ".[dev]"
```

That installs **pytest** and **pytest-asyncio** (needed for async tests).

## Run tests

```bash
.venv/bin/pytest
```

Run a single file:

```bash
.venv/bin/pytest test/test_6_reminder_sender.py
```

Verbose:

```bash
.venv/bin/pytest -v
```

Most exercises ship with tests **skipped** (`@pytest.mark.skip`); remove or narrow the skip when you work on that module. One test (reminder sender) is left **enabled** on purpose.

`test_6_reminder_sender` wraps `send_all` in **`asyncio.wait_for(..., timeout=2.0)`**, the same wall-clock pressure as **Mocha’s default 2000 ms test timeout** in the JavaScript version. A single slow `send` can pass; real retries and `asyncio.sleep(1.1)` often push past 2 s, so the test **fails intermittently** until participants introduce a seam (for example replacing sleeps / the sender with fast doubles).

## Layout

| Test file | Roughly maps to |
|-----------|------------------|
| `test/test_1_speaker_feedback.py` | Speaker feedback |
| `test/test_2_badge_printer.py` | Badge printing |
| `test/test_3_room_availability.py` | Room availability |
| `test/test_5_schedule_to_text.py` | Schedule → text |
| `test/test_6_reminder_sender.py` | Reminder sender |

Source lives under `src/` in packages such as `speaker_feedback`, `badge_printing`, and so on.

## Optional: editable install without dev tools

If you only want to import the packages without pytest:

```bash
pip install -e .
```

For the workshop, use `.[dev]` so you can run tests.
