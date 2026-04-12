// Messy formatter that mixes layout, time arithmetic, and locale rules.
export class ScheduleFormatter {
  format(scheduleObject, options = {}) {
    const { locale = 'en-US', timezoneOffset = 0, conferenceDay, timezone = 'UTC' } = options

    if (!scheduleObject || !Array.isArray(scheduleObject.sessions)) {
      return 'No sessions available.\n'
    }

    const sorted = [...scheduleObject.sessions].sort((a, b) => {
      if (!a.start && !b.start) {
        return 0
      }
      if (!a.start) {
        return 1
      }
      if (!b.start) {
        return -1
      }
      return a.start.localeCompare(b.start)
    })

    const dayLabel = conferenceDay ? `Day ${conferenceDay}` : 'Conference'
    const tzLabel = timezoneOffset === 0
      ? 'UTC'
      : timezone

    let output = `# Conference Schedule – ${dayLabel} (${tzLabel})\n\n`

    for (const session of sorted) {
      const title = session.title || 'Untitled Session'
      const speaker = session.speaker ? ` – ${session.speaker}` : ''
      const room = session.room || 'TBD'
      const displayStart = this.#shiftTime(session.start || '??:??', timezoneOffset)
      const displayEnd = session.length
        ? this.#shiftTime(this.#addMinutes(session.start || '00:00', session.length), timezoneOffset)
        : null
      const timeRange = displayEnd ? `${displayStart}–${displayEnd}` : displayStart
      const typeTag = session.type ? ` [${session.type}]` : ''

      output += `* ${timeRange} ${title}${speaker} @ ${room}${typeTag}\n`
    }

    return output
  }

  #shiftTime(timeStr, offsetMinutes) {
    if (!timeStr || timeStr.includes('?')) {
      return timeStr
    }
    const [h, m] = timeStr.split(':').map(Number)
    const totalMinutes = h * 60 + m + offsetMinutes
    const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
    const adjH = Math.floor(normalized / 60)
    const adjM = normalized % 60
    return `${String(adjH).padStart(2, '0')}:${String(adjM).padStart(2, '0')}`
  }

  #addMinutes(timeStr, minutes) {
    const [h, m] = timeStr.split(':').map(Number)
    const total = h * 60 + m + minutes
    const endH = Math.floor(total / 60) % 24
    const endM = total % 60
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  }
}
