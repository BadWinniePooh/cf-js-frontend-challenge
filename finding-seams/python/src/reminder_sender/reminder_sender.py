from __future__ import annotations

from datetime import datetime, timezone

from reminder_sender.sends_reminders import Reminder, send_reminders


class ReminderSender:
    """Reminder sender that mixes timing, throttling and business rules."""

    def __init__(self) -> None:
        self._retry_count = 3

    async def send_all(self, reminders: list[Reminder]) -> None:
        now_ms = int(datetime.now(tz=timezone.utc).timestamp() * 1000)

        for reminder in reminders:
            send_at_time = self._to_timestamp(reminder.get("sendAt"))

            if send_at_time <= now_ms:
                await self._retry_reminder_sending(reminder)

    async def _retry_reminder_sending(self, reminder: Reminder) -> None:
        current_count = 0
        while True:
            try:
                await send_reminders.send(reminder)
                return
            except Exception:
                print("Error sending reminder: ", "Retrying...")
            cond = current_count < self._retry_count
            current_count += 1
            if not cond:
                break

    def _to_timestamp(self, value: str | int | float | datetime | None) -> int:
        if isinstance(value, datetime):
            return int(value.timestamp() * 1000)
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, str):
            try:
                parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            except ValueError:
                return int(datetime.now(tz=timezone.utc).timestamp() * 1000)
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            return int(parsed.timestamp() * 1000)
        return int(datetime.now(tz=timezone.utc).timestamp() * 1000)
