import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Match extends BaseModel {
  @afterFind()
  public static async afterFindHook(match: Match) {
    await match.load('users')
  }

  @afterFetch()
  public static async afterFetchHook(matches: Match[]) {
    await Promise.all(matches.map((match) => {
        return match.load('users')
      })
    )
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public isCompleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'user_matches',
    pivotColumns: ['amount', 'in_match'],
    serializeAs: null,
  })
  public users: ManyToMany<typeof User>

  @computed()
  public get getUsers(): User[] {
    return this.users
  }
}
