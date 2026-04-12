import type { TimeSlot } from './room-registry.js'
import { roomRegistry } from './room-registry.js'

type AcceptedResult = {
  sessionId: number
  roomId: string
  timeSlot: TimeSlot
  status: 'ACCEPTED'
};
type ErrorResult = {
  sessionId: number
  roomId: string
  timeSlot: TimeSlot
  status: 'REJECTED'
  reason: string
};
export type PlaceSessionResult = AcceptedResult | ErrorResult

// Legacy-style service that talks directly to the global registry.
export class RoomService {

  placeSessionInRoom(sessionId: number, roomId: string, timeSlot: TimeSlot): PlaceSessionResult {
    if (!roomRegistry.isAvailable(roomId, timeSlot)) {
      return {
        sessionId,
        roomId,
        timeSlot,
        status: 'REJECTED',
        reason: 'Room not available',
      }
    }

    roomRegistry.reserve(roomId, timeSlot)

    return {
      sessionId,
      roomId,
      timeSlot,
      status: 'ACCEPTED',
    }
  }
}
