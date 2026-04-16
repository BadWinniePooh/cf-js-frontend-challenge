from __future__ import annotations

from typing import Literal, TypedDict

from room_availability.room_registry import TimeSlot, room_registry


class AcceptedResult(TypedDict):
    sessionId: int
    roomId: str
    timeSlot: TimeSlot
    status: Literal["ACCEPTED"]


class RejectedResult(TypedDict):
    sessionId: int
    roomId: str
    timeSlot: TimeSlot
    status: Literal["REJECTED"]
    reason: str


PlaceSessionResult = AcceptedResult | RejectedResult


class RoomService:
    """Legacy-style service that talks directly to the global registry."""

    def place_session_in_room(
        self, session_id: int, room_id: str, time_slot: TimeSlot
    ) -> PlaceSessionResult:
        if not room_registry.is_available(room_id, time_slot):
            return {
                "sessionId": session_id,
                "roomId": room_id,
                "timeSlot": time_slot,
                "status": "REJECTED",
                "reason": "Room not available",
            }

        room_registry.reserve(room_id, time_slot)

        return {
            "sessionId": session_id,
            "roomId": room_id,
            "timeSlot": time_slot,
            "status": "ACCEPTED",
        }
