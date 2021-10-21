import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export const WIN_POINTS_AMOUNT = 10
export const DRAW_POINTS_AMOUNT = 0
export const LOSE_POINTS_AMOUNT = -10

export const POINTS_AMOUNTS = [
  WIN_POINTS_AMOUNT,
  DRAW_POINTS_AMOUNT,
  LOSE_POINTS_AMOUNT,
]

export interface UserMatchInterface {
  userId: number,
  matchId: number,
  amount: number,
}

export default class UserMatch extends BaseModel implements UserMatchInterface {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public matchId: number

  @column()
  public amount: number

  @column()
  public inMatch: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
