/**
 * Assembles a sessionDetails object from the provided fields, filling in
 * sensible defaults for anything optional that was left out.
 *
 * @param {object} fields
 * @param {string}  fields.id            - optional, unique session identifier - defaults to crypto.randomUUID()
 * @param {string}  fields.title         - required, session display title
 * @param {string}  [fields.day]         - optional, scheduling day
 * @param {string}  [fields.room]        - optional, scheduling room
 * @param {Array}   [fields.tags]        - defaults to []
 * @param {string}  [fields.startTime]   - optional, e.g. from a time input (HH:mm)
 * @param {string}  [fields.sessionType] - optional, e.g. Talk / Workshop
 * @param {Array}   [fields.attendees]   - defaults to []
 * @returns {{ id: string, title: string, day?: string, room?: string, tags: Array, attendees: Array, startTime?: string, sessionType?: string }}
 */
export function sessionDetails({
  id,
  title,
  day,
  room,
  tags ,
  attendees,
  startTime,
  sessionType,
} = {}) {
  const defaults = { id: crypto.randomUUID(), tags: [], attendees: [] }
  const base = buildBaseWithKeysHavingValues(id, title, day, room, tags, attendees, startTime, sessionType)
  return {...defaults, ...base}
}

function buildBaseWithKeysHavingValues(id, title, day, room, tags, attendees) {
  const base = Object.entries({ id, title, day, room, tags, attendees }).reduce((acc, [key, value]) => {
    if (value !== undefined) acc[key] = value
    return acc
  }, {})
  return base
}
