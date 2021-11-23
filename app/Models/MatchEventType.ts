import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export const matchEventTypes = [
  'defining'
]

export default class MatchEventType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
