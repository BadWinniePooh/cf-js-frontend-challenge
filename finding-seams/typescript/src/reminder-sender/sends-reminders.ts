const delay = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export type Reminder = {
  id: string
  email: string
  sendAt?: Date | string | number
}

export class SendsReminders {
  // This is logic that mimics production behavior (it's slow, and sometimes throws exceptions)
  // Do not touch this logic!
  async send(reminder: Reminder): Promise<void> {
    console.log(`Sending reminder ${reminder.id} to ${reminder.email}`)
    // This delay makes the test fail, as the test only has 2000ms time to succeed.
    await delay(1100)
    // And sometimes the logic just fails
    const outcome = Math.random()
    if (outcome < 0.40) {
      throw new Error('Failed to send reminder')
    }
  }
}

export const sendReminders = new SendsReminders()
