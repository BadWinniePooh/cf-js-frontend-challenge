// get current user
// is user authenticated
// find attendee

export class SignupHandler {
  #sessionRepository
  #userRepository

  constructor(sessionRepository, userRepository) {
    this.#sessionRepository = sessionRepository
    this.#userRepository = userRepository
  }

  signUpUserToSession(userId, sessionId) {
    const session = this.#sessionRepository.findById(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    const user = this.#userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    session.attend(user.id)

    this.#sessionRepository.save(session)
  }
}
