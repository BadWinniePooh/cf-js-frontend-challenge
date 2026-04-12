from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import TypedDict


class Room(TypedDict):
    id: str
    name: str


class TimeSlot(TypedDict):
    startingTime: str
    duration: int


class RoomRegistry:
    """
    Singleton-style global registry with shared mutable state.
    In real life, this would store the data somewhere using a Repository or such.
    """

    def __init__(self) -> None:
        self._rooms: dict[str, Room] = {}
        # dicts are not hashable in sets like JS object identity; list mirrors reservation history.
        self._reservations: dict[str, list[TimeSlot]] = {}

    def register(self, room: Room | None) -> None:
        if not room or not room.get("id"):
            raise ValueError("Room must have an id")
        self._rooms[room["id"]] = room

    def reserve(self, room_id: str, time_slot: TimeSlot) -> None:
        if room_id not in self._rooms:
            raise ValueError(f"Room not found: {room_id}")
        existing = self._reservations.setdefault(room_id, [])
        existing.append(time_slot)

    def is_available(self, room_id: str, time_slot: TimeSlot) -> bool:
        room_exists = self._rooms.get(room_id)
        if not room_exists:
            return False
        reservations = self._reservations.get(room_id) or []
        return not any(
            self._is_time_slots_overlapping(time_slot, reservation)
            for reservation in reservations
        )

    _STARTING_TIME_RE = re.compile(
        r"^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}) (CET|CEST|UTC)$"
    )

    def _parse_starting_time_ms(self, starting_time: str) -> int:
        m = self._STARTING_TIME_RE.match(str(starting_time))
        if not m:
            raise ValueError(f"Invalid startingTime: {starting_time}")
        ymd, hh, mm, tz = m.group(1), m.group(2), m.group(3), m.group(4)
        offset = "+01:00" if tz == "CET" else "+02:00" if tz == "CEST" else "Z"
        dt = datetime.fromisoformat(f"{ymd}T{hh}:{mm}:00{offset}")
        ms = int(dt.timestamp() * 1000)
        return ms

    def _slot_interval_ms(self, slot: TimeSlot) -> tuple[int, int]:
        start_ms = self._parse_starting_time_ms(slot["startingTime"])
        duration_ms = slot["duration"] * 1000 * 60
        end_ms = start_ms + duration_ms
        return start_ms, end_ms

    def _is_time_slots_overlapping(self, a: TimeSlot, b: TimeSlot) -> bool:
        a0, a1 = self._slot_interval_ms(a)
        b0, b1 = self._slot_interval_ms(b)
        return not (a0 >= b1 or a1 <= b0)


room_registry = RoomRegistry()
