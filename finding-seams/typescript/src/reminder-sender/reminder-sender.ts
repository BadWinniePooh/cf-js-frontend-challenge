import { sendReminders } from './sends-reminders.js'
import type { Reminder } from './sends-reminders.js'

// Reminder sender that mixes timing, throttling and business rules.
export class ReminderSender {
  #retryCount = 3

  constructor() {
  }

  // reminders: [{ id, email, sendAt: Date|string|number }]
  async sendAll(reminders: Reminder[]): Promise<void> {
    const now = Date.now()

    for (const reminder of reminders) {
      const sendAtTime = this.#toTimestamp(reminder.sendAt)

      if (sendAtTime <= now) {
        await this.#retryReminderSending(reminder)
      }
    }
  }

  async #retryReminderSending(reminder: Reminder): Promise<void> {
    let currentCount = 0
    do {
      try {
        return await sendReminders.send(reminder)
      } catch {
        console.error('Error sending reminder: ', 'Retrying...')
      }
    } while (currentCount++ < this.#retryCount)
  }

  #toTimestamp(value: Date | string | number | undefined): number {
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
