export type TimeSlot = {
  startingTime: string
  duration: number
}

export type Room = {
  id: string
  name: string
}

// Singleton-style global registry with shared mutable state.
// In real life, this would store the data somewhere using a Repository or such.
export class RoomRegistry {
  #rooms: Map<string, Room>
  #reservations: Map<string, Set<TimeSlot>>

  constructor() {
    this.#rooms = new Map()
    this.#reservations = new Map()
  }

  // { id: string, name: string }
  register(room: Room): void {
    if (!room || !room.id) {
      throw new Error('Room must have an id')
    }

    this.#rooms.set(room.id, room)
  }

  reserve(roomId: string, timeSlot: TimeSlot): void {
    if (!this.#rooms.has(roomId)) {
      throw new Error(`Room not found: ${roomId}`)
    }

    const existing = this.#reservations.get(roomId) ?? new Set<TimeSlot>()
    existing.add(timeSlot)
    this.#reservations.set(roomId, existing)
  }

  // timeslot { startingTime: Datetime, duration: number }
  isAvailable(roomId: string, timeSlot: TimeSlot): boolean {
    const roomExists = this.#rooms.get(roomId)
    if (!roomExists) {
      return false // We don't have such rooms
    }
    const reservationsByRoomId = Array.from(this.#reservations.get(roomId) ?? [])
    return !reservationsByRoomId.some(reservation =>
      this.#isTimeSlotsOverlapping(timeSlot, reservation),
    )
  }

  // startingTime format: '2026-01-11T10:00 CET' (date, then HH:MM, then space and zone)
  #parseStartingTimeMs(startingTime: string): number {
    const m = String(startingTime).match(
      /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}) (CET|CEST|UTC)$/,
    )
    if (!m) {
      throw new Error(`Invalid startingTime: ${startingTime}`)
    }
    const [, ymd, hh, mm, tz] = m
    const offset = tz === 'CET' ? '+01:00' : tz === 'CEST' ? '+02:00' : 'Z'
    const ms = Date.parse(`${ymd}T${hh}:${mm}:00${offset}`)
    if (Number.isNaN(ms)) {
      throw new Error(`Invalid startingTime: ${startingTime}`)
    }
    return ms
  }

  #slotIntervalMs(slot: TimeSlot): { startMs: number, endMs: number } {
    const startMs = this.#parseStartingTimeMs(slot.startingTime)
    const durationMs = slot.duration * 1000 * 60
    const endMs = startMs + durationMs
    return { startMs, endMs }
  }

  // Treats each slot as [start, end) in milliseconds; overlaps if ranges intersect.
  #isTimeSlotsOverlapping(a: TimeSlot, b: TimeSlot): boolean {
    const { startMs: a0, endMs: a1 } = this.#slotIntervalMs(a)
    const { startMs: b0, endMs: b1 } = this.#slotIntervalMs(b)
    return !(a0 >= b1 || a1 <= b0)
  }
}

export const roomRegistry = new RoomRegistry()
