# Step 7 Backend (super simple)

Tiny Node backend for Step 7. Uses built-in `node:http` only (no framework).

## Why this approach?

- Smallest possible dependency footprint
- Easy to read for challenge participants

## Routes

- `GET /api/schedule/:eventId`
- `GET /api/sessions/:eventId`
- `PUT /api/sessions/:eventId/:sessionId` (create or replace one full session)
- `PATCH /api/sessions/:eventId/:sessionId` (partial update for an existing session)
- `DELETE /api/sessions/:eventId/:sessionId` (remove an existing session)

Unknown `eventId` returns `404`.

### PUT body example

```json
{
  "title": "Lightning Talks",
  "day": "Friday",
  "room": "Track C",
  "tags": [{ "label": "Talk", "color": "orange" }],
  "attendees": [ 
    { "name": "Aino Korhonen", "initials": "AK" },
    { "name": "Jess Smith", "initials": "JS" }
  ]
}
```

### PATCH body example

```json
{
  "room": "Track D",
  "attendees": [ 
    { "name": "Aino Korhonen", "initials": "AK" },
  ]
}
```

## Run

```bash
cd frontend/step-7-be
npm start
```

Optional port override:

```bash
PORT=4000 npm start
```

## Test

```bash
cd frontend/step-7-be
npm test
```

## Notes for step-7 frontend

If you want to hit this server directly from Step 7 (without MSW), point fetch calls to:

- `http://localhost:3001/api/schedule/:eventId`
- `http://localhost:3001/api/sessions/:eventId`

This server already enables permissive CORS for local development.
