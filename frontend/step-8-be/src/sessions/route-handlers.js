import { randomUUID } from 'node:crypto'
import { sessions } from '../../../step-7-be/src/fake-data/sessions.js'
import { schedules } from '../../../step-7-be/src/fake-data/schedules.js'
import { json } from '../../../step-7-be/src/http-utils.js'
import { generateRandomSession } from '../lib/generate-random-session.js'

export async function handlePostRandomSession(req, res, { params }) {
  const eventId = params.eventId
  if (!sessions[eventId] || !schedules[eventId]) {
    json(res, 404, { error: `Unknown eventId "${eventId}"` })
    return
  }

  const session = {
    ...generateRandomSession(),
    id: randomUUID(),
    eventId,
  }

  sessions[eventId].push(session)
  json(res, 201, session)
}
