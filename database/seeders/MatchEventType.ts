import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import MatchEventType, { matchEventTypes } from 'App/Models/MatchEventType'

export default class MatchEventTypeSeeder extends BaseSeeder {
  public async run () {
    const matchEvents = matchEventTypes.map((matchEventType) => {
      return {
        type: matchEventType
      }
    })

    await MatchEventType.createMany(matchEvents)
  }
}
