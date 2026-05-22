import test from 'node:test'
import assert from 'node:assert/strict'
import { WebSocketServer } from 'ws'
import {
  broadcast,
  createBroadcaster,
  parseWsEventId,
  wsSessionsPath,
} from '../src/session-broadcast.js'

test('wsSessionsPath and parseWsEventId round-trip eventId', () => {
  assert.equal(wsSessionsPath('codefreeze-2025'), '/ws/sessions/codefreeze-2025')
  assert.equal(parseWsEventId('/ws/sessions/codefreeze-2025'), 'codefreeze-2025')
  assert.equal(parseWsEventId('/ws/sessions/devdays%202025'), 'devdays 2025')
  assert.equal(parseWsEventId('/ws/sessions'), null)
  assert.equal(parseWsEventId('/ws/sessions/a/b'), null)
  assert.equal(parseWsEventId('/ws/unknown'), null)
})

test('broadcast only sends to clients subscribed to the same eventId', () => {
  const received = []
  const wss = {
    clients: new Set([
      { readyState: 1, eventId: 'codefreeze-2025', send: (msg) => received.push(['cf', msg]) },
      { readyState: 1, eventId: 'devdays-2025', send: (msg) => received.push(['dd', msg]) },
      { readyState: 1, eventId: 'codefreeze-2025', send: (msg) => received.push(['cf2', msg]) },
    ]),
  }

  broadcast(wss, 'codefreeze-2025', { type: 'sessionUpdated', session: { id: 'cf25-1' } })

  assert.equal(received.length, 2)
  assert.deepEqual(received[0], ['cf', '{"type":"sessionUpdated","session":{"id":"cf25-1"}}'])
  assert.deepEqual(received[1], ['cf2', '{"type":"sessionUpdated","session":{"id":"cf25-1"}}'])
})

test('createBroadcaster sends sessionUpdated to connected clients on matching eventId', async () => {
  const wss = new WebSocketServer({ port: 0 })
  wss.on('connection', (ws) => {
    ws.eventId = 'codefreeze-2025'
  })
  const broadcaster = createBroadcaster(wss)
  const port = wss.address().port

  const client = await openClient(`ws://127.0.0.1:${port}`)
  const messagePromise = nextMessage(client)

  broadcaster.sessionUpdated({
    id: 'cf25-live',
    eventId: 'codefreeze-2025',
    title: 'Impromptu Session',
    day: 'Thursday',
    room: 'Lounge',
    tags: [],
    attendees: [],
  })

  const message = await messagePromise
  assert.deepEqual(message, {
    type: 'sessionUpdated',
    session: {
      id: 'cf25-live',
      eventId: 'codefreeze-2025',
      title: 'Impromptu Session',
      day: 'Thursday',
      room: 'Lounge',
      tags: [],
      attendees: [],
    },
  })

  client.close()
  await closeServer(wss)
})

test('createBroadcaster does not send sessionUpdated to clients on another eventId', async () => {
  const wss = new WebSocketServer({ port: 0 })
  wss.on('connection', (ws) => {
    ws.eventId = 'devdays-2025'
  })
  const broadcaster = createBroadcaster(wss)
  const port = wss.address().port

  const client = await openClient(`ws://127.0.0.1:${port}`)
  const noMessage = waitForMessage(client, 50)

  broadcaster.sessionUpdated({
    id: 'cf25-live',
    eventId: 'codefreeze-2025',
    title: 'Impromptu Session',
    day: 'Thursday',
    room: 'Lounge',
    tags: [],
    attendees: [],
  })

  await assert.rejects(noMessage, /timed out/)

  client.close()
  await closeServer(wss)
})

test('createBroadcaster sends sessionRemoved to clients on matching eventId', async () => {
  const wss = new WebSocketServer({ port: 0 })
  wss.on('connection', (ws) => {
    ws.eventId = 'codefreeze-2025'
  })
  const broadcaster = createBroadcaster(wss)
  const port = wss.address().port

  const client = await openClient(`ws://127.0.0.1:${port}`)
  const messagePromise = nextMessage(client)

  broadcaster.sessionRemoved('codefreeze-2025', 'cf25-1')

  const message = await messagePromise
  assert.deepEqual(message, {
    type: 'sessionRemoved',
    eventId: 'codefreeze-2025',
    sessionId: 'cf25-1',
  })

  client.close()
  await closeServer(wss)
})

function openClient(url) {
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
      (event) => {
        resolve(JSON.parse(String(event.data)))
      },
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

function closeServer(wss) {
  return new Promise((resolve, reject) => {
    wss.close((error) => (error ? reject(error) : resolve()))
  })
}
