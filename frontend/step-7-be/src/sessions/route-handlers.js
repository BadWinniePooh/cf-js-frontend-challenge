import { sessions } from '../fake-data/sessions.js'
import { schedules } from '../fake-data/schedules.js'
import { json, readJsonBody } from '../http-utils.js'

export async function updateSessionDetails(req, res, { params }) {
  const eventId = params.eventId
  const sessionId = params.sessionId
  if (!sessions[eventId] || !schedules[eventId]) {
    json(res, 404, { error: `Unknown eventId "${eventId}"` })
    return
  }

  const existingIdx = sessions[eventId].findIndex((s) => s.id === sessionId)
  if (existingIdx < 0) {
    json(res, 404, { error: `Unknown sessionId "${sessionId}" for event "${eventId}"` })
    return
  }

  const payload = await readJsonBody(req)
  const previous = sessions[eventId][existingIdx]
  const updated = {
    ...previous,
    ...payload,
    id: sessionId,
    eventId,
    tags: Array.isArray(payload.tags) ? payload.tags : previous.tags,
    attendees: Array.isArray(payload.attendees) ? payload.attendees : previous.attendees
  }

  sessions[eventId][existingIdx] = updated
  json(res, 200, updated)
}

export async function handleGetSessions(req, res, { params }) {
  const eventSessions = sessions[params.eventId]
  if (!eventSessions) {
    json(res, 404, { error: `Unknown eventId "${params.eventId}"` })
    return
  }
  json(res, 200, eventSessions)
}

export async function addNewSession(req, res, { params }) {
  const eventId = params.eventId
  const sessionId = params.sessionId
  if (!sessions[eventId] || !schedules[eventId]) {
    json(res, 404, { error: `Unknown eventId "${eventId}"` })
    return
  }

  const payload = await readJsonBody(req)
  if (!payload?.title || !payload?.day) {
    json(res, 400, { error: 'PUT session payload requires at least title and day' })
    return
  }

  const session = {
    ...payload,
    id: sessionId,
    eventId,
    room: payload.room ?? 'TBD',
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    attendees: Array.isArray(payload.attendees) ? payload.attendees : []
  }

  const existingIdx = sessions[eventId].findIndex((s) => s.id === sessionId)
  if (existingIdx >= 0) {
    sessions[eventId][existingIdx] = session
  } else {
    sessions[eventId].push(session)
  }

  json(res, 200, session)
}