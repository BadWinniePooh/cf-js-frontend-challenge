import test from 'node:test'
import assert from 'node:assert/strict'
import { handleGetSchedule } from '../src/schedules/route-handlers.js'

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

test('handleGetSchedule returns schedule for known event', async () => {
  const req = {}
  const res = createFakeRes()

  await handleGetSchedule(req, res, { params: { eventId: 'codefreeze-2025' } })

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.eventId, 'codefreeze-2025')
  assert.ok(res.body.name)
})

test('handleGetSchedule returns 404 for unknown event', async () => {
  const req = {}
  const res = createFakeRes()

  await handleGetSchedule(req, res, { params: { eventId: 'does-not-exist' } })

  assert.equal(res.statusCode, 404)
  assert.match(res.body.error, /Unknown eventId/)
})
