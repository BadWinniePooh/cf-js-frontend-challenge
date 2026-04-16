import asyncio

import pytest

from reminder_sender.reminder_sender import ReminderSender

# Match Mocha’s default test timeout (2000 ms): slow real sleeps + retries must finish
# quickly, or the test fails. That pressure is what makes this exercise interesting.
_REMINDER_TEST_TIMEOUT_SEC = 2.0


@pytest.mark.asyncio
async def test_sends_reminders_qyuickly() -> None:
    reminder_sender = ReminderSender()

    await asyncio.wait_for(
        reminder_sender.send_all([{"id": "1", "email": "foo@example.com"}]),
        timeout=_REMINDER_TEST_TIMEOUT_SEC,
    )

    # As written, this often violates the deadline above — until you introduce a seam.
