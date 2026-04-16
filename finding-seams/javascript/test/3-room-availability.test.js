import { expect } from 'chai'
import { RoomService } from '../src/room-availability/room-service.js'
import { roomRegistry } from '../src/room-availability/room-registry.js'

describe.skip('RoomService', () => {
  const exampleTimeslot = { startingTime: '2026-01-11T10:00 CET', duration: 60 }

  it('assigns room', async () => {
    roomRegistry.register({ id: 'room-1', name: 'Ekin Kammi' })
    const roomService = new RoomService()

    const result = roomService.placeSessionInRoom(1, 'room-1', exampleTimeslot)

    expect(result).to.eql({
      sessionId: 1,
      roomId: 'room-1',
      status: 'ACCEPTED',
      timeSlot: exampleTimeslot,
    })
  })

  it.skip('fails to assign room', async () => {
    // Inject a shape with methos 'isAvailable' that you can control
    const roomService = new RoomService()

    const conflictingSlot = {
      startingTime: '2026-01-11T09:30 CET',
      duration: 60,
    }
    const result = roomService.placeSessionInRoom(1, 'room-1', conflictingSlot)

    expect(result).to.eql({
      sessionId: 1,
      roomId: 'room-1',
      status: 'REJECTED',
      reason: 'Room not available',
      timeSlot: conflictingSlot,
    })
  })
})
