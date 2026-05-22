import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { WebSocketServer } from 'ws'
import { Router } from '../../step-7-be/src/router.js'
import { json, sendNoContent } from '../../step-7-be/src/http-utils.js'
import { handleGetSchedule } from '../../step-7-be/src/schedules/route-handlers.js'
import {
  handleDeleteSession,
  handleGetSessions,
  handlePatchSession,
  handlePutSession,
} from '../../step-7-be/src/sessions/route-handlers.js'
import { schedules } from '../../step-7-be/src/fake-data/schedules.js'
import { handlePostRandomSession } from './sessions/route-handlers.js'
import { createBroadcaster, parseWsEventId, wsSessionsPath } from './session-broadcast.js'
import { wrapHandler } from './wrap-handler.js'

const PORT = Number(process.env.PORT ?? 3001)

export function createStep8Backend() {
  const wss = new WebSocketServer({ noServer: true })
  const broadcaster = createBroadcaster(wss)
  const router = new Router()

  router.get('/api/schedule/:eventId', handleGetSchedule)
  router.get('/api/sessions/:eventId', handleGetSessions)
  router.put(
    '/api/sessions/:eventId/:sessionId',
    wrapHandler(handlePutSession, ({ body }) => {
      if (body?.id) broadcaster.sessionUpdated(body)
    })
  )
  router.patch(
    '/api/sessions/:eventId/:sessionId',
    wrapHandler(handlePatchSession, ({ body }) => {
      if (body?.id) broadcaster.sessionUpdated(body)
    })
  )
  router.delete(
    '/api/sessions/:eventId/:sessionId',
    wrapHandler(handleDeleteSession, ({ params }) => {
      broadcaster.sessionRemoved(params.eventId, params.sessionId)
    })
  )
  router.post(
    '/api/sessions/:eventId/random',
    wrapHandler(handlePostRandomSession, ({ body }) => {
      if (body?.id) broadcaster.sessionUpdated(body)
    })
  )

  const httpServer = createServer((req, res) => {
    if (!req.url) {
      json(res, 400, { error: 'Missing URL' })
      return
    }

    if (req.method === 'OPTIONS') {
      sendNoContent(res)
      return
    }

    const method = req.method ?? 'GET'
    const pathname = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`).pathname
    const result = router.resolve(method, pathname)

    if (result.status === 'method_not_allowed') {
      json(res, 405, { error: 'Method Not Allowed' })
      return
    }
    if (result.status === 'not_found') {
      json(res, 404, { error: 'Not Found' })
      return
    }

    Promise.resolve(result.handler(req, res, { params: result.params })).catch((error) => {
      json(res, 400, { error: error.message || 'Request failed' })
    })
  })

  httpServer.on('upgrade', (req, socket, head) => {
    const pathname = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`).pathname
    const eventId = parseWsEventId(pathname)
    if (!eventId || !schedules[eventId]) {
      socket.destroy()
      return
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      ws.eventId = eventId
      wss.emit('connection', ws, req)
    })
  })

  return { httpServer, wss, broadcaster }
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const { httpServer } = createStep8Backend()
  httpServer.listen(PORT, () => {
    console.log(`step-8-be listening on http://localhost:${PORT}`)
    console.log(
      `WebSocket feed: ws://localhost:${PORT}${wsSessionsPath('codefreeze-2025')}`
    )
  })
}
