import { FeedbackSensor } from './feedback-sensor.js'

export type EvaluateSpeakerResult = {
  status: 'ALERT' | 'BOOK_AGAIN' | 'OK'
  averageScore: number | null
}

export class SpeakerFeedbackService {
  #sensor: FeedbackSensor
  #alertThreshold = 2.2

  constructor() {
    this.#sensor = new FeedbackSensor()
  }

  /**
   * Collect scores from the unreliable sensor, retrying on failures,
   * and classify the speaker.
   *
   * Returns an object like:
   * { status: 'ALERT' | 'BOOK_AGAIN' | 'OK', averageScore: number | null }
   */
  evaluateSpeaker(): EvaluateSpeakerResult {
    const scores = this.#sensor.readScores()

    if (!scores || scores.length === 0) {
      return {
        status: 'ALERT',
        averageScore: null,
      }
    }

    const validScores = scores.filter(
      score => typeof score === 'number' && score >= 1 && score <= 5,
    )

    if (validScores.length === 0) {
      return {
        status: 'ALERT',
        averageScore: null,
      }
    }

    const sum = validScores.reduce((acc, value) => acc + value, 0)
    const average = sum / validScores.length

    if (average < this.#alertThreshold) {
      return {
        status: 'ALERT',
        averageScore: average,
      }
    }

    return {
      status: 'OK',
      averageScore: average,
    }
  }
}
