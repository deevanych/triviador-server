import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { MatchFactory } from 'Database/factories/Match'

export const CREATED_MATCHES_COUNT = 100

export default class MatchSeeder extends BaseSeeder {
  public async run () {
    await MatchFactory.createMany(CREATED_MATCHES_COUNT)
  }
}
