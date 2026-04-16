from __future__ import annotations

import functools
from typing import TypedDict


class ScheduleSession(TypedDict, total=False):
    start: str
    length: int
    title: str
    speaker: str | None
    room: str
    track: str
    type: str


class ScheduleObject(TypedDict):
    sessions: list[ScheduleSession]


class ScheduleFormatOptions(TypedDict, total=False):
    locale: str
    timezoneOffset: int
    conferenceDay: int
    timezone: str


class ScheduleFormatter:
    """Messy formatter that mixes layout, time arithmetic, and locale rules."""

    def format(
        self,
        schedule_object: ScheduleObject | None,
        options: ScheduleFormatOptions | None = None,
    ) -> str:
        opts: ScheduleFormatOptions = options or {}
        _ = opts.get("locale", "en-US")
        timezone_offset = opts.get("timezoneOffset", 0)
        conference_day = opts.get("conferenceDay")
        timezone = opts.get("timezone", "UTC")

        if not schedule_object or not isinstance(schedule_object.get("sessions"), list):
            return "No sessions available.\n"

        sessions = list(schedule_object["sessions"])

        def cmp_sessions(a: ScheduleSession, b: ScheduleSession) -> int:
            if not a.get("start") and not b.get("start"):
                return 0
            if not a.get("start"):
                return 1
            if not b.get("start"):
                return -1
            a_start = a.get("start") or ""
            b_start = b.get("start") or ""
            if a_start < b_start:
                return -1
            if a_start > b_start:
                return 1
            return 0

        sorted_sessions = sorted(sessions, key=functools.cmp_to_key(cmp_sessions))

        day_label = f"Day {conference_day}" if conference_day is not None else "Conference"
        tz_label = "UTC" if timezone_offset == 0 else timezone

        output = f"# Conference Schedule – {day_label} ({tz_label})\n\n"

        for session in sorted_sessions:
            title = session.get("title") or "Untitled Session"
            speaker_val = session.get("speaker")
            speaker = f" – {speaker_val}" if speaker_val else ""
            room = session.get("room") or "TBD"
            display_start = self._shift_time(session.get("start") or "??:??", timezone_offset)
            length = session.get("length")
            if length:
                display_end = self._shift_time(
                    self._add_minutes(session.get("start") or "00:00", length),
                    timezone_offset,
                )
                time_range = f"{display_start}–{display_end}"
            else:
                time_range = display_start
            stype = session.get("type")
            type_tag = f" [{stype}]" if stype else ""

            output += f"* {time_range} {title}{speaker} @ {room}{type_tag}\n"

        return output

    def _shift_time(self, time_str: str, offset_minutes: int) -> str:
        if not time_str or "?" in time_str:
            return time_str
        parts = time_str.split(":")
        h_raw = int(parts[0]) if len(parts) > 0 else 0
        m_raw = int(parts[1]) if len(parts) > 1 else 0
        total_minutes = h_raw * 60 + m_raw + offset_minutes
        normalized = ((total_minutes % (24 * 60)) + 24 * 60) % (24 * 60)
        adj_h = normalized // 60
        adj_m = normalized % 60
        return f"{adj_h:02d}:{adj_m:02d}"

    def _add_minutes(self, time_str: str, minutes: int) -> str:
        parts = time_str.split(":")
        h_raw = int(parts[0]) if len(parts) > 0 else 0
        m_raw = int(parts[1]) if len(parts) > 1 else 0
        total = h_raw * 60 + m_raw + minutes
        end_h = (total // 60) % 24
        end_m = total % 60
        return f"{end_h:02d}:{end_m:02d}"
