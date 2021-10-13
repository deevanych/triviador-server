import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import { UserFactory } from 'Database/factories/User'

export const CREATED_USERS_COUNT = 100

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run () {
    await UserFactory.createMany(CREATED_USERS_COUNT)
  }
}
