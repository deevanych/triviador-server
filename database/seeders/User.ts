import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { randomInt } from 'crypto'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        email: 'virk@adonisjs.com',
        password: 'secret',
        rating: randomInt(0, 9999),
      },
      {
        email: 'romain@adonisjs.com',
        password: 'supersecret',
        rating: randomInt(0, 9999),
      },
      {
        email: 'gnida@adonisjs.com',
        password: 'megasecret',
        rating: randomInt(0, 9999),
      }
    ])
  }
}
