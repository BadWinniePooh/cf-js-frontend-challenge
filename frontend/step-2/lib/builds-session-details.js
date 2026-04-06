/**
 * Assembles a sessionDetails object from the provided fields, filling in
 * sensible defaults for anything optional that was left out.
 *
 * @param {object} fields
 * @param {string}  fields.id          - required, unique session identifier
 * @param {string}  fields.title       - required, session display title
 * @param {string}  [fields.day]       - optional, scheduling day
 * @param {string}  [fields.room]      - optional, scheduling room
 * @param {Array}   [fields.tags]      - defaults to []
 * @param {string}  [fields.startTime]   - optional, e.g. from a time input (HH:mm)
 * @param {string}  [fields.sessionType] - optional, e.g. Talk / Workshop
 * @param {Array}   [fields.attendees] - defaults to []
 * @returns {{ id: string, title: string, day?: string, room?: string, tags: Array, attendees: Array, startTime?: string, sessionType?: string }}
 */
export function sessionDetails({
  id,
  title,
  day,
  room,
  tags = [],
  attendees = [],
  startTime,
  sessionType,
} = {}) {
  const base = { id, title, day, room, tags, attendees }
  if (startTime !== undefined) base.startTime = startTime
  if (sessionType !== undefined) base.sessionType = sessionType
  return base
}
