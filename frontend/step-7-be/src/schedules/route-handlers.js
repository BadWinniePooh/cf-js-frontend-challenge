import { schedules } from '../fake-data/schedules.js'
import { json } from '../http-utils.js'

export async function handleGetSchedule(req, res, { params }) {
  const schedule = schedules[params.eventId]
  if (!schedule) {
    json(res, 404, { error: `Unknown eventId "${params.eventId}"` })
    return
  }
  json(res, 200, schedule)
}