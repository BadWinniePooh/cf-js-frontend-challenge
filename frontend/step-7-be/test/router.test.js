import test from 'node:test'
import assert from 'node:assert/strict'
import { Router } from '../src/router.js'

test('matches route by method and path params', () => {
  const router = new Router()
  const handler = () => {}
  router.get('/api/schedule/:eventId', handler)

  const result = router.resolve('GET', '/api/schedule/codefreeze-2025')

  assert.equal(result.status, 'matched')
  assert.equal(result.handler, handler)
  assert.deepEqual(result.params, { eventId: 'codefreeze-2025' })
})

test('returns method_not_allowed when path exists for other method', () => {
  const router = new Router()
  router.put('/api/sessions/:eventId/:sessionId', () => {})

  const result = router.resolve('PATCH', '/api/sessions/codefreeze-2025/cf25-1')

  assert.equal(result.status, 'method_not_allowed')
})

test('returns not_found when path is unknown', () => {
  const router = new Router()
  router.get('/api/sessions/:eventId', () => {})

  const result = router.resolve('GET', '/api/unknown/codefreeze-2025')

  assert.equal(result.status, 'not_found')
})

test('decodes URL params', () => {
  const router = new Router()
  router.get('/api/schedule/:eventId', () => {})

  const result = router.resolve('GET', '/api/schedule/devdays%202025')

  assert.equal(result.status, 'matched')
  assert.deepEqual(result.params, { eventId: 'devdays 2025' })
})

test('supports DELETE route helper', () => {
  const router = new Router()
  const deleteHandler = () => {}
  router.delete('/api/sessions/:eventId/:sessionId', deleteHandler)

  const result = router.resolve('DELETE', '/api/sessions/codefreeze-2025/cf25-1')

  assert.equal(result.status, 'matched')
  assert.equal(result.handler, deleteHandler)
  assert.deepEqual(result.params, {
    eventId: 'codefreeze-2025',
    sessionId: 'cf25-1'
  })
})

test('supports PUT and PATCH route helpers', () => {
  const router = new Router()
  const putHandler = () => {}
  const patchHandler = () => {}
  router.put('/api/sessions/:eventId/:sessionId', putHandler)
  router.patch('/api/sessions/:eventId/:sessionId', patchHandler)

  const putResult = router.resolve('PUT', '/api/sessions/codefreeze-2025/cf25-99')
  const patchResult = router.resolve('PATCH', '/api/sessions/codefreeze-2025/cf25-99')

  assert.equal(putResult.status, 'matched')
  assert.equal(putResult.handler, putHandler)
  assert.deepEqual(putResult.params, {
    eventId: 'codefreeze-2025',
    sessionId: 'cf25-99'
  })

  assert.equal(patchResult.status, 'matched')
  assert.equal(patchResult.handler, patchHandler)
})
