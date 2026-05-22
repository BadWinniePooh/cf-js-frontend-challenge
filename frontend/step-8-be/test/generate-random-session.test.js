import test from 'node:test'
import assert from 'node:assert/strict'
import { generateRandomSession } from '../src/lib/generate-random-session.js'

test('generateRandomSession returns required session fields', () => {
  const session = generateRandomSession()

  assert.ok(session.title)
  assert.ok(session.day)
  assert.ok(session.room)
  assert.equal(Array.isArray(session.tags), true)
  assert.equal(session.tags.length, 1)
  assert.equal(Array.isArray(session.attendees), true)
  assert.ok(session.attendees.length >= 1)
})
