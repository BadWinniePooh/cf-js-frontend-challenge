import asyncio
import random
from typing import TypedDict


class Reminder(TypedDict, total=False):
    id: str
    email: str
    sendAt: str | int | float


class SendsReminders:
    """Logic that mimics production behavior (it's slow, and sometimes throws exceptions). Do not touch."""

    async def send(self, reminder: Reminder) -> None:
        print(f"Sending reminder {reminder['id']} to {reminder['email']}")
        await asyncio.sleep(1.1)
        outcome = random.random()
        if outcome < 0.40:
            raise RuntimeError("Failed to send reminder")


send_reminders = SendsReminders()
