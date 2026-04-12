import { roomRegistry } from './room-registry.js'

// Legacy-style service that talks directly to the global registry.
export class RoomService {
  placeSessionInRoom(sessionId, roomId, timeSlot) {
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

