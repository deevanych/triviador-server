import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserMatchFactory } from 'Database/factories/UserMatch'
import { POINTS_AMOUNTS } from 'App/Models/UserMatch'
import { CREATED_MATCHES_COUNT } from 'Database/seeders/Match'

export const CREATED_USERS_RATING_ROWS_COUNT = CREATED_MATCHES_COUNT * POINTS_AMOUNTS.length

export default class UserMatchSeeder extends BaseSeeder {
  public async run () {
    await UserMatchFactory.createMany(CREATED_USERS_RATING_ROWS_COUNT)
  }
}
