import { expect } from 'chai'
import { SpeakerFeedbackService } from '../src/speaker-feedback/speaker-feedback.js'

describe.skip('speaker-feedback', () => {
  it('calculates average score', () => {
    const speakerFeedback = new SpeakerFeedbackService()

    const result = speakerFeedback.evaluateSpeaker()

    expect(result).to.eql({ status: 'OK', averageScore: 3.6 })
  })
})
