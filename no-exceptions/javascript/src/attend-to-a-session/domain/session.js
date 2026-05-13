export class Session {
  #attendees = []

  constructor(id) {
    this.id = id
  }

  attend(userId) {
    this.#attendees.push(userId)
  }

  getAttendees() {
    return [...this.#attendees]
  }
}
