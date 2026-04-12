import { sendReminders } from './sends-reminders.js'

// Reminder sender that mixes timing, throttling and business rules.
export class ReminderSender {
  #retryCount = 3
  constructor() {
  }

  // reminders: [{ id, email, sendAt: Date|string|number }]
  async sendAll(reminders) {
    const now = Date.now()

    for (const reminder of reminders) {
      const sendAtTime = this.#toTimestamp(reminder.sendAt)

      if (sendAtTime <= now) {
        await this.#retryReminderSending(reminder)
      }
    }
  }

  async #retryReminderSending(reminder) {
    let currentCount = 0
    do {
      try {
        return await sendReminders.send(reminder)
      } catch (_) {
        console.error('Error sending reminder: ',  'Retrying...') // eslint-disable-line no-console
      }
    } while (currentCount++ < this.#retryCount)
  }

  #toTimestamp(value) {
    if (value instanceof Date) {
      return value.getTime()
    }
    if (typeof value === 'number') {
      return value
    }
    if (typeof value === 'string') {
      const parsed = Date.parse(value)
      if (!Number.isNaN(parsed)) {
        return parsed
      }
    }
    // Fallback to "now" for bad values.
    return Date.now()
  }
}

