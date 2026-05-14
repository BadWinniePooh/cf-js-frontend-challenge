import { User } from '../domain/user.js'

export class UserRepository {
  #users = {}


  findById(id) {
    if (id === 'this-id-simulates-exception-on-db-read') {
      throw new Error('Db error: connection failed')
    }
    return this.#users[id]
  }

  // For the acceptance test purposes.
  addUser(userId) {
    this.#users[userId] = new User(userId)
  }
}
