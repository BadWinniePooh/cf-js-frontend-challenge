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
  let aRandomUserId
  let existingSession

  beforeEach(() => {
    sessionRepository = new SessionRepository()
    userRepository = new UserRepository()
    signupHandler = new SignupHandler(sessionRepository, userRepository)
    aRandomUserId = v4()
    existingSession = new Session(v4())
  })

  it('when everything is fine', () => {
    // Setup Data to database
    sessionRepository.addSession(existingSession)
    userRepository.addUser(aRandomUserId)

    // Act
    signupHandler.signUpUserToSession(aRandomUserId, existingSession.id)

    // Assert the direct sife-effect
    const sessionFromRepo = sessionRepository.findById(existingSession.id)
    expect(sessionFromRepo.getAttendees()).to.deep.equal([aRandomUserId])
  })

  describe('when done with the exercise - these do not throw exceptions but the interface is something different', () => {

    it('fails when reading from UserDb fails ', () => {
      sessionRepository.addSession(existingSession)
      const fetchingUserFromDbFails = 'this-id-simulates-exception-on-db-read'
      const fn = () => signupHandler.signUpUserToSession(fetchingUserFromDbFails, existingSession.id)

      expect(fn).to.throw('Db error: connection failed')
    })

    it('fails when user not found ', () => {
      sessionRepository.addSession(existingSession)
      const attendeeNotFound = 'any-user-not-in-repository'
      const fn = () => signupHandler.signUpUserToSession(attendeeNotFound, existingSession.id)

      expect(fn).to.throw('Attendee not found')
    })

    it('fails when session not found ', () => {
      const nonExistingSessionId = v4()
      const fn = () => signupHandler.signUpUserToSession(aRandomUserId, nonExistingSessionId)

      expect(fn).to.throw('Session not found')
    })

    it('fails when sessionRepository fails to fetch', () => {
      const sessionIdThatFetchingFailsInRepository = 'test-session'

      const fn = () => signupHandler.signUpUserToSession(aRandomUserId, sessionIdThatFetchingFailsInRepository)

      expect(fn).to.throw('Error in retrieving session')
    })

    it('fails when saving fails', () => {
      const sessionWhereSavingFailsInRepository = new Session('test-session-save-fails')
      sessionRepository.addSession(sessionWhereSavingFailsInRepository)
      userRepository.addUser(aRandomUserId)

      const fn = () => signupHandler.signUpUserToSession(aRandomUserId, sessionWhereSavingFailsInRepository.id)

      expect(fn).to.throw('Error on save')
    })
  })
})
