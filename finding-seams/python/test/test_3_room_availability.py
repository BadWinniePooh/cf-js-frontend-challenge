import pytest

from room_availability.room_registry import room_registry
from room_availability.room_service import RoomService


@pytest.mark.skip(reason="Exercise: finding seams — enable when working on room availability")
def test_assigns_room() -> None:
    example_timeslot = {"startingTime": "2026-01-11T10:00 CET", "duration": 60}

    room_registry.register({"id": "room-1", "name": "Ekin Kammi"})
    room_service = RoomService()

    result = room_service.place_session_in_room(1, "room-1", example_timeslot)

    assert result == {
        "sessionId": 1,
        "roomId": "room-1",
        "status": "ACCEPTED",
        "timeSlot": example_timeslot,
    }


@pytest.mark.skip(reason="Exercise: finding seams — inject a shape with method is_available")
def test_fails_to_assign_room() -> None:
    room_service = RoomService()

    conflicting_slot = {
        "startingTime": "2026-01-11T09:30 CET",
        "duration": 60,
    }
    result = room_service.place_session_in_room(1, "room-1", conflicting_slot)

    assert result == {
        "sessionId": 1,
        "roomId": "room-1",
        "status": "REJECTED",
        "reason": "Room not available",
        "timeSlot": conflicting_slot,
    }
