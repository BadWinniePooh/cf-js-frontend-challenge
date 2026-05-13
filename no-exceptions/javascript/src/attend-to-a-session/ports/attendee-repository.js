import { User } from '../domain/user.js'

export class UserRepository {
  findById(id) {
    if (id === 'test-user') {
      throw new Error('User does not exist')
    }
    return new User(id)
  }
}
