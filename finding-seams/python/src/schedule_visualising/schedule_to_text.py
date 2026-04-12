from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, TypedDict

from schedule_visualising.schedule_formatter import ScheduleFormatter, ScheduleSession


CONFERENCE_START = datetime(2025, 11, 3, tzinfo=timezone.utc)
CONFERENCE_DURATION_DAYS = 3

TIMEZONE_OFFSETS: dict[str, int] = {
    "UTC": 0,
    "Europe/Helsinki": 120,
    "Europe/Stockholm": 60,
    "Europe/London": 0,
    "America/New_York": -300,
    "America/Chicago": -360,
    "America/Los_Angeles": -480,
}

SUPPORTED_LOCALES = ("en-US", "en-GB", "fi-FI", "sv-SE", "de-DE")


def _days_between(a: datetime, b: datetime) -> int:
    ms_per_day = 1000 * 60 * 60 * 24
    return int((b.timestamp() * 1000 - a.timestamp() * 1000) // ms_per_day)


def _to_date_string(d: datetime) -> str:
    u = d.astimezone(timezone.utc)
    return f"{u.year:04d}-{u.month:02d}-{u.day:02d}"


class ConvertToTextOptions(TypedDict, total=False):
    timezone: str
    locale: str
    track: str
    includeBreaks: bool
    types: list[str]


class ScheduleToText:
    """Legacy-style converter that mixes date logic, filtering, and formatting."""

    def __init__(self) -> None:
        self._formatter = ScheduleFormatter()
        self._schedule_dir = Path(__file__).resolve().parent

    def _coerce_requested_date(self, date: datetime | int | float | str) -> datetime | None:
        if isinstance(date, datetime):
            rd = date
            if rd.tzinfo is None:
                rd = rd.replace(tzinfo=timezone.utc)
            return rd
        if isinstance(date, (int, float)):
            return datetime.fromtimestamp(float(date) / 1000.0, tz=timezone.utc)
        text = str(date)
        if text.isdigit():
            return datetime.fromtimestamp(int(text) / 1000.0, tz=timezone.utc)
        try:
            rd = datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            return None
        if rd.tzinfo is None:
            rd = rd.replace(tzinfo=timezone.utc)
        return rd

    async def convert_to_text(
        self,
        date: datetime | int | float | str,
        options: ConvertToTextOptions | None = None,
    ) -> str:
        """
        All this is seemingly important code.
        It is here only to make the code longer - you don't need to spend any time understanding
        what this does. It's there only to make the function longer
        """
        opts: ConvertToTextOptions = options or {}

        requested_date = self._coerce_requested_date(date)
        if requested_date is None:
            return "Invalid date provided.\n"

        try:
            requested_date.timestamp()
        except (OSError, OverflowError, ValueError):
            return "Invalid date provided.\n"

        day_index = _days_between(CONFERENCE_START, requested_date)
        if day_index < 0 or day_index >= CONFERENCE_DURATION_DAYS:
            return f"No schedule available for {requested_date.strftime('%c')}.\n"

        conference_day = day_index + 1
        date_string = _to_date_string(requested_date)

        tz_name = opts.get("timezone", "UTC")
        timezone_offset = TIMEZONE_OFFSETS.get(tz_name, 0)
        loc = opts.get("locale")
        locale = loc if loc in SUPPORTED_LOCALES else "en-US"
        track = opts.get("track", "all")
        include_breaks = opts.get("includeBreaks") is not False
        allowed_types = opts.get("types", ["talk", "workshop", "break"])

        """
        That's end of the 'not-so-important code'
        """

        file_path = self._schedule_dir / f"schedule-{date_string}.json"
        raw = file_path.read_text(encoding="utf-8")
        schedule_data: dict[str, Any] = json.loads(raw)

        """
        Code for controlling the output
        """

        sessions: list[ScheduleSession] = list(schedule_data.get("sessions", []))
        if track != "all":
            sessions = [
                s
                for s in sessions
                if s.get("track") == track or s.get("track") == "all"
            ]
        if not include_breaks:
            sessions = [s for s in sessions if s.get("type") != "break"]
        sessions = [
            s
            for s in sessions
            if isinstance(s.get("type"), str) and s["type"] in allowed_types
        ]

        formatting_options = {
            "locale": locale,
            "timezoneOffset": timezone_offset,
            "conferenceDay": conference_day,
            "timezone": tz_name,
        }

        """
        And here print it.
        """
        return self._formatter.format({"sessions": sessions}, formatting_options)
