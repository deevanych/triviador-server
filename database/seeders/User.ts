import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import { UserFactory } from 'Database/factories/User'

export default class UserSeeder extends BaseSeeder {
  public static developmentOnly = true

  public async run () {
    await UserFactory.createMany(100)
  }
}
