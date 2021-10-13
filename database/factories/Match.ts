import Factory from '@ioc:Adonis/Lucid/Factory'
import Match from 'App/Models/Match'

export const MatchFactory = Factory
  .define(Match, () => { return {} })
  .build()
