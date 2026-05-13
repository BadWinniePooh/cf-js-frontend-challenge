import { expect } from 'chai'
import { SessionRepository } from '../src/attend-to-a-session/ports/session-repository.js'
import { UserRepository } from '../src/attend-to-a-session/ports/attendee-repository.js'
import { SignupHandler } from '../src/attend-to-a-session/routes/signup-to-session.js'
import { v4 } from 'uuid'
import { Session } from '../src/attend-to-a-session/domain/session.js'

describe('acceptance test', () => {
  let sessionRepository
  let userRepository
  let signupHandler
  let session
  let userId

  beforeEach(() => {
    sessionRepository = new SessionRepository()
    session = new Session(v4())
    sessionRepository.addSession(session)
    userRepository = new UserRepository()
    signupHandler = new SignupHandler(sessionRepository, userRepository)
    userId = v4()
  })

  it('when everything is fine', () => {
    signupHandler.signUpUserToSession(userId, session.id)

    const sessionFromRepo = sessionRepository.findById(session.id)

    expect(sessionFromRepo.getAttendees()).to.deep.equal([userId])
  })

  describe('when done with the exercise - these do not throw exceptions but the interface is something different', () => {

    it('fails when user not found ', () => {
      const nonExistingUserId = 'test-user'
      const fn = () => signupHandler.signUpUserToSession(nonExistingUserId, session.id)

      expect(fn).to.throw('User does not exist')
    })

    it('fails when session not found ', () => {
      const nonExistingSessionId = v4()
      const fn = () => signupHandler.signUpUserToSession(userId, nonExistingSessionId)

      expect(fn).to.throw('Session not found')
    })

    it('fails when sessionRepository fails to fetch', () => {
      const sessionIdThatFetchingFailsInRepository = 'test-session'

      const fn = () => signupHandler.signUpUserToSession(userId, sessionIdThatFetchingFailsInRepository)

      expect(fn).to.throw('Error in retrieving session')
    })

    it('fails when saving fails', () => {
      const sessionWhereSavingFailsInRepository = new Session('test-session-save-fails')
      sessionRepository.addSession(sessionWhereSavingFailsInRepository)

      const fn = () => signupHandler.signUpUserToSession(userId, sessionWhereSavingFailsInRepository.id)

      expect(fn).to.throw('Error on save')
    })
  })
})
