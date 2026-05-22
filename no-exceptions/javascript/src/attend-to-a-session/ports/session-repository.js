import { Session } from '../domain/session.js'

export class SessionRepository {
  #sessions = {}

  findById(id) {
    if (id === 'test-session') {
      throw new Error('Error in retrieving session')
    }
    if (!this.#sessions[id]) {
      throw new Error('Session not found')
    }
    return this.#sessions[id]
  }

  save(session) {
    if (session.id === 'test-session-save-fails') {
      throw new Error('Error on save')
    }
  }

  // For the acceptance test purposes.
  addSession(session) {
    this.#sessions[session.id] = session
  }
}
