import { createServer } from 'node:http'
import { Router } from './router.js'
import { json, sendNoContent } from './http-utils.js'
import {
  handleDeleteSession,
  handleGetSessions,
  handlePatchSession,
  handlePutSession
} from './sessions/route-handlers.js'
import { handleGetSchedule } from './schedules/route-handlers.js'

const PORT = Number(process.env.PORT ?? 3001)

const router = new Router()

router.get('/api/schedule/:eventId', handleGetSchedule)
router.get('/api/sessions/:eventId', handleGetSessions)
router.put('/api/sessions/:eventId/:sessionId', handlePutSession)
router.patch('/api/sessions/:eventId/:sessionId', handlePatchSession)
router.delete('/api/sessions/:eventId/:sessionId', handleDeleteSession)

const server = createServer((req, res) => {
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

  Promise.resolve(result.handler(req, res, { params: result.params }))
    .catch((error) => {
      json(res, 400, { error: error.message || 'Request failed' })
    })
})

server.listen(PORT, () => {
  console.log(`step-7-be listening on http://localhost:${PORT}`)
})
