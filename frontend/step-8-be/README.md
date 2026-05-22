# Step 8 Backend — live session feed

Extends [step-7-be](../step-7-be) with WebSocket push notifications and a random-session endpoint.

Reuses step-7-be modules for routing, HTTP helpers, schedules, and session CRUD. Step 8 adds broadcast wiring in `server.js` plus the random-session handler.

## Routes (HTTP)

All step-7 routes, plus:

- `DELETE /api/sessions/:eventId/:sessionId` — remove a session (also available in step-7-be)
- `POST /api/sessions/:eventId/random` — add a random session (simulates another user adding one)

## WebSocket

- URL: `ws://localhost:3001/ws/sessions/:eventId` (same port as HTTP)
- Example: `ws://localhost:3001/ws/sessions/codefreeze-2025`
- Clients only receive pushes for the `eventId` in their connection URL
- Unknown `eventId` values are rejected at upgrade time
- Messages are JSON:

```json
{ "type": "sessionUpdated", "session": { "id": "...", "eventId": "...", "title": "...", ... } }
```

```json
{ "type": "sessionRemoved", "eventId": "codefreeze-2025", "sessionId": "cf25-1" }
```

Connected clients receive a push after every successful `PUT`, `PATCH`, `DELETE`, or `POST …/random` **for their subscribed event**.

## Run

```bash
cd frontend/step-8-be
yarn install
yarn start
```

Optional port override:

```bash
PORT=4000 yarn start
```

## Test

```bash
yarn test
```

## Notes for step-8 frontend

Point `<cfb-live-updates data-url="ws://localhost:3001/ws/sessions/codefreeze-2025">` at this server when exercising live updates without MSW (include the event id in the URL).

To simulate a colleague adding a session:

```bash
curl -X POST http://localhost:3001/api/sessions/codefreeze-2025/random
```
