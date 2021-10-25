import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export const INITIAL_TYPE = 'initial'
export const DEFINING_TYPE = 'defining'
export const PLAYER_TURN_TYPE = 'player'

export const DEFINING_ROUND_COUNT = 6

export interface MatchStageInterface {
  userId?: number,
  matchId: number,
  type?: string
}

export default class MatchStage extends BaseModel implements MatchStageInterface {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public matchId: number

  @column()
  public type: string

  @column()
  public userId: number

  @column()
  public isPassed: boolean
}
