import { ReminderSender } from '../src/reminder-sender/reminder-sender.js'

describe('reminder-sender', () => {
  it('sends reminders qyuickly', async () => {
    const reminderSender = new ReminderSender()

    await reminderSender.sendAll([{ id: '1', email: 'foo@example.com' }])

    // Should not fail!
  })
})
