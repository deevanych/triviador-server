import { EventsList } from '@ioc:Adonis/Core/Event'
import { MatchService } from 'App/Services/MatchService'

export default class Match {
  public async onNewMatch(match: EventsList['new:match']) {
    await MatchService.defining(match)
  }
}
