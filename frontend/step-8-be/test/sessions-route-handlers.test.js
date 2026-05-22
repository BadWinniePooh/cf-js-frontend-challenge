import test from 'node:test'
import assert from 'node:assert/strict'
import { handlePostRandomSession } from '../src/sessions/route-handlers.js'
import { sessions } from '../../step-7-be/src/fake-data/sessions.js'

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
    },
  }
}

test('handlePostRandomSession creates a random session for known event', async () => {
  const eventId = 'codefreeze-2025'
  const before = sessions[eventId].length
  const req = {}
  const res = createFakeRes()

  try {
    await handlePostRandomSession(req, res, { params: { eventId } })

    assert.equal(res.statusCode, 201)
    assert.equal(res.body.eventId, eventId)
    assert.ok(res.body.id)
    assert.ok(res.body.title)
    assert.equal(sessions[eventId].length, before + 1)
    assert.equal(sessions[eventId].some((s) => s.id === res.body.id), true)
  } finally {
    const idx = sessions[eventId].findIndex((s) => s.id === res.body?.id)
    if (idx >= 0) sessions[eventId].splice(idx, 1)
  }
})

test('handlePostRandomSession returns 404 for unknown event', async () => {
  const req = {}
  const res = createFakeRes()

  await handlePostRandomSession(req, res, { params: { eventId: 'does-not-exist' } })

  assert.equal(res.statusCode, 404)
  assert.match(res.body.error, /Unknown eventId/)
})
