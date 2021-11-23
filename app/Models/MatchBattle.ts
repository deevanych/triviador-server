import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class MatchBattle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public question_id: number

  @column()
  public match_id: number

  @manyToMany(() => User, {
    pivotTable: 'match_battle_users',
    pivotColumns: ['is_initiator']
  })
  public users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
