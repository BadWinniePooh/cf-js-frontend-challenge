import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import {
  handleGetSessions,
  updateSessionDetails,
  addNewSession
} from '../src/sessions/route-handlers.js'
import { sessions } from '../src/fake-data/sessions.js'

function createFakeRes() {
  return {
    statusCode: null,
    headers: null,
    body: null,
    writeHead(statusCode, headers) {
      this.statusCode = statusCode
      this.headers = headers
    },
    end(payload) {
      this.body = payload ? JSON.parse(payload) : null
    }
  }
}

function createJsonReq(payload) {
  const req = new EventEmitter()
  process.nextTick(() => {
    req.emit('data', JSON.stringify(payload))
    req.emit('end')
  })
  return req
}

test('handleGetSessions returns list for known event', async () => {
  const req = {}
  const res = createFakeRes()

  await handleGetSessions(req, res, { params: { eventId: 'codefreeze-2025' } })

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, sessions['codefreeze-2025'])
})

test('handlePutSession creates new session and enforces ids from params', async () => {
  const eventId = 'codefreeze-2025'
  const sessionId = 'cf25-test-put'
  const before = sessions[eventId].length
  const req = createJsonReq({
    id: 'ignored-id',
    eventId: 'ignored-event',
    title: 'Test PUT Session',
    day: 'Friday'
  })
  const res = createFakeRes()

  try {
    await addNewSession(req, res, { params: { eventId, sessionId } })

    assert.equal(res.statusCode, 200)
    assert.equal(res.body.id, sessionId)
    assert.deepEqual(res.body, {id: 'cf25-test-put', eventId: 'codefreeze-2025', title: 'Test PUT Session', day: 'Friday', room: 'TBD', tags: [], attendees: [] })
    // TODO: this is not really a good test, but I'll let it slip for now, as this is just a demo
    assert.equal(sessions[eventId].length, before + 1)
  } finally {
    const idx = sessions[eventId].findIndex((s) => s.id === sessionId)
    if (idx >= 0) sessions[eventId].splice(idx, 1)
  }
})

test('handlePutSession returns 400 when title/day missing', async () => {
  const req = createJsonReq({ title: 'Missing day' })
  const res = createFakeRes()

  await addNewSession(req, res, {
    params: { eventId: 'codefreeze-2025', sessionId: 'cf25-test-bad' }
  })

  assert.equal(res.statusCode, 400)
  assert.match(res.body.error, /requires at least title and day/)
})

test('handlePatchSession updates existing session fields', async () => {
  const eventId = 'codefreeze-2025'
  const sessionId = 'cf25-1'
  const existing = sessions[eventId].find((s) => s.id === sessionId)
  const oldRoom = existing.room
  const req = createJsonReq({ room: 'Patched Room' })
  const res = createFakeRes()

  try {
    await updateSessionDetails(req, res, { params: { eventId, sessionId } })

    assert.equal(res.statusCode, 200)
    assert.equal(res.body.room, 'Patched Room')
  } finally {
    existing.room = oldRoom
  }
})

test('handlePatchSession returns 404 for unknown session', async () => {
  const req = createJsonReq({ room: 'X' })
  const res = createFakeRes()

  await updateSessionDetails(req, res, {
    params: { eventId: 'codefreeze-2025', sessionId: 'missing-id' }
  })

  assert.equal(res.statusCode, 404)
  assert.match(res.body.error, /Unknown sessionId/)
})
