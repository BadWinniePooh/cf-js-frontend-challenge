// get current user
// is user authenticated
// find attendee
import { v4 } from 'uuid'
import { SignupHandler } from '../../../src/attend-to-a-session/routes/signup-to-session.js'
import { expect, use } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

use(sinonChai)

describe('Session object', () => {
  let userId
  let sessionId
  let session
  let user
  let sessionRepository
  let userRepository

  beforeEach(() => {
    userId = v4()
    sessionId = v4()

    sessionRepository = {
      findById: (_) => session,
      save: sinon.spy(),
    }
    userRepository = {
      findById: (userId) => user,
    }
  })

  describe('This is behavior that we want to change - none of these should throw exceptions', () => {
    it('throws an error when user does not exist', () => {
      session = acts.as.session()
      userRepository = {
        findById: (userId) => null,
      }

      const signupHandler = new SignupHandler(sessionRepository, userRepository)

      const fn = () => signupHandler.signUpUserToSession(userId, sessionId)

      expect(fn).to.throw('User not found')
      expect(sessionRepository.save).to.not.have.been.called
    })

    it('throws an error when session does not exist', () => {
      sessionRepository.findById = () => null
      const signupHandler = new SignupHandler(sessionRepository, userRepository)

      const fn = () => signupHandler.signUpUserToSession(userId, sessionId)

      expect(fn).to.throw('Session not found')
      expect(sessionRepository.save).to.not.have.been.called
    })

    it('throws an error when saving fails', () => {
      session = dummy.as.session()
      user = acts.as.user()
      sessionRepository.save = () => {
        throw new Error('Error on save')
      }
      const signupHandler = new SignupHandler(sessionRepository, userRepository)

      const fn = () => signupHandler.signUpUserToSession(userId, sessionId)

      expect(fn).to.throw('Error on save')
    })
  })

  it('everything works', () => {
    session = acts.as.session({
      attend: sinon.spy(),
    })
    user = acts.as.user({
      id: userId,
    })

    const signupHandler = new SignupHandler(sessionRepository, userRepository)

    signupHandler.signUpUserToSession(userId, sessionId)

    // verify by message being sent
    expect(session.attend).to.have.been.calledWith(userId)
    expect(sessionRepository.save).to.have.been.calledWith(session)
  })

  describe('when things go wrong', () => {})
})

const acts = {
  as: {
    session: (mockWith = {}) => mockSessionWith(mockWith),
    user: (mockWith = {}) => mockUserWith(mockWith),
  },
}

const dummy = {
  as: {
    session: (mockWith = {}) => mockSessionWith({ attend: sinon.spy() }),
    user: (mockWith = {}) => mockUserWith(mockWith),
  },
}

const throwsNotImplemented =
  (msg = 'not implemented') =>
  () => {
    throw new Error(`Unexpected message sent: '${msg}'`)
  }

const mockSessionWith = (mockWith) => {
  const defaultData = {
    save: throwsNotImplemented('save'),
    attend: throwsNotImplemented('attend'),
  }
  return { ...defaultData, ...mockWith }
}

const mockUserWith = (mockWith) => {
  const defaultData = {
    id: v4(),
  }
  return { ...defaultData, ...mockWith }
}
