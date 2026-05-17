import test from 'node:test'
import assert from 'node:assert/strict'
import { createStep8Backend } from '../src/server.js'
import { wsSessionsPath } from '../src/session-broadcast.js'
import { sessions } from '../../step-7-be/src/fake-data/sessions.js'

test('POST random session broadcasts sessionUpdated to matching eventId WebSocket', async () => {
  const eventId = 'codefreeze-2025'
  const { httpServer } = createStep8Backend()
  await listen(httpServer)

  const address = httpServer.address()
  const baseUrl = `http://127.0.0.1:${address.port}`
  const wsUrl = `ws://127.0.0.1:${address.port}${wsSessionsPath(eventId)}`

  const client = await openWebSocket(wsUrl)
  const messagePromise = nextMessage(client)

  const res = await fetch(`${baseUrl}/api/sessions/${eventId}/random`, {
    method: 'POST',
  })
  assert.equal(res.status, 201)
  const created = await res.json()

  const message = await messagePromise
  assert.equal(message.type, 'sessionUpdated')
  assert.deepEqual(message.session, created)

  client.close()
  await closeHttpServer(httpServer)

  const idx = sessions[eventId].findIndex((s) => s.id === created.id)
  if (idx >= 0) sessions[eventId].splice(idx, 1)
})

test('broadcast is scoped to WebSocket eventId subscription', async () => {
  const eventId = 'codefreeze-2025'
  const { httpServer } = createStep8Backend()
  await listen(httpServer)

  const address = httpServer.address()
  const baseUrl = `http://127.0.0.1:${address.port}`
  const subscribedUrl = `ws://127.0.0.1:${address.port}${wsSessionsPath(eventId)}`
  const otherUrl = `ws://127.0.0.1:${address.port}${wsSessionsPath('devdays-2025')}`

  const subscribedClient = await openWebSocket(subscribedUrl)
  const otherClient = await openWebSocket(otherUrl)
  const subscribedPromise = nextMessage(subscribedClient)
  const otherPromise = waitForMessage(otherClient, 50)

  const res = await fetch(`${baseUrl}/api/sessions/${eventId}/random`, { method: 'POST' })
  assert.equal(res.status, 201)
  const created = await res.json()

  const message = await subscribedPromise
  assert.equal(message.type, 'sessionUpdated')
  assert.deepEqual(message.session, created)

  await assert.rejects(otherPromise, /timed out/)

  subscribedClient.close()
  otherClient.close()
  await closeHttpServer(httpServer)

  const idx = sessions[eventId].findIndex((s) => s.id === created.id)
  if (idx >= 0) sessions[eventId].splice(idx, 1)
})

test('DELETE session broadcasts sessionRemoved to matching eventId WebSocket', async () => {
  const eventId = 'codefreeze-2025'
  const sessionId = 'cf25-test-ws-delete'
  sessions[eventId].push({
    id: sessionId,
    eventId,
    title: 'WS Delete Test',
    day: 'Friday',
    room: 'TBD',
    tags: [],
    attendees: [],
  })

  const { httpServer } = createStep8Backend()
  await listen(httpServer)

  const address = httpServer.address()
  const baseUrl = `http://127.0.0.1:${address.port}`
  const wsUrl = `ws://127.0.0.1:${address.port}${wsSessionsPath(eventId)}`

  const client = await openWebSocket(wsUrl)
  const messagePromise = nextMessage(client)

  const res = await fetch(`${baseUrl}/api/sessions/${eventId}/${sessionId}`, {
    method: 'DELETE',
  })
  assert.equal(res.status, 204)

  const message = await messagePromise
  assert.deepEqual(message, {
    type: 'sessionRemoved',
    eventId,
    sessionId,
  })

  client.close()
  await closeHttpServer(httpServer)
})

test('WebSocket upgrade requires known eventId in path', async () => {
  const { httpServer } = createStep8Backend()
  await listen(httpServer)

  const address = httpServer.address()
  const port = address.port

  await assert.rejects(openWebSocket(`ws://127.0.0.1:${port}/ws/unknown`))
  await assert.rejects(openWebSocket(`ws://127.0.0.1:${port}/ws/sessions`))
  await assert.rejects(openWebSocket(`ws://127.0.0.1:${port}${wsSessionsPath('does-not-exist')}`))

  await closeHttpServer(httpServer)
})

function listen(httpServer) {
  return new Promise((resolve) => {
    httpServer.listen(0, '127.0.0.1', resolve)
  })
}

function closeHttpServer(httpServer) {
  return new Promise((resolve, reject) => {
    httpServer.close((error) => (error ? reject(error) : resolve()))
  })
}

function openWebSocket(url) {
  return new Promise((resolve, reject) => {
    const client = new WebSocket(url)
    client.addEventListener('open', () => resolve(client), { once: true })
    client.addEventListener('error', reject, { once: true })
  })
}

function nextMessage(client) {
  return new Promise((resolve, reject) => {
    client.addEventListener(
      'message',
      (event) => resolve(JSON.parse(String(event.data))),
      { once: true }
    )
    client.addEventListener('error', reject, { once: true })
  })
}

function waitForMessage(client, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timed out')), ms)
    client.addEventListener(
      'message',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true }
    )
  })
}
