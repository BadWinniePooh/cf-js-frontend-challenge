import test from 'node:test'
import assert from 'node:assert/strict'
import { wrapHandler } from '../src/wrap-handler.js'

function createFakeRes() {
  return {
    statusCode: null,
    body: null,
    writeHead(statusCode) {
      this.statusCode = statusCode
    },
    end(payload) {
      this.body = payload ? JSON.parse(payload) : null
    },
  }
}

test('wrapHandler calls onSuccess after successful handler', async () => {
  const baseHandler = async (_req, res) => {
    res.writeHead(200)
    res.end(JSON.stringify({ id: 'cf25-1' }))
  }
  const wrapped = wrapHandler(baseHandler, ({ body, params }) => {
    assert.deepEqual(body, { id: 'cf25-1' })
    assert.deepEqual(params, { eventId: 'codefreeze-2025' })
  })

  await wrapped({}, createFakeRes(), { params: { eventId: 'codefreeze-2025' } })
})

test('wrapHandler does not call onSuccess for error responses', async () => {
  let called = false
  const baseHandler = async (_req, res) => {
    res.writeHead(404)
    res.end(JSON.stringify({ error: 'missing' }))
  }
  const wrapped = wrapHandler(baseHandler, () => {
    called = true
  })

  await wrapped({}, createFakeRes(), { params: {} })

  assert.equal(called, false)
})
