import { DateTime } from 'luxon'
import {
  afterFind,
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Question from 'App/Models/Question'

export default class MatchBattle extends BaseModel {
  @afterFind()
  public static async afterFindHook(matchBattle: MatchBattle) {
    await matchBattle.load('users')
    await matchBattle.load('question')
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public questionId: number

  @column()
  public matchId: number

  @manyToMany(() => User, {
    pivotTable: 'match_battle_users',
    pivotColumns: ['is_initiator']
  })
  public users: ManyToMany<typeof User>

  @belongsTo(() => Question)
  public question: BelongsTo<typeof Question>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
