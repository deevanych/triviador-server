import User from 'App/Models/User'
import * as faker from 'faker'
import { CREATED_USERS_COUNT } from 'Database/seeders/User'

export default class AuthController {
  public async login ({ auth }): Promise<string> {
    const userId = faker.datatype.number({ min: 1, max: CREATED_USERS_COUNT })
    const user = User.findOrFail(userId)

    return await auth.use('api').generate(user)
  }
}
