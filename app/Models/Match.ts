import { DateTime } from 'luxon'
import { afterFind, BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Match extends BaseModel {
  @afterFind()
  public static async afterFindHook(match: Match) {
    await match.load('users')
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

  @computed()
  public get getRoom(): string {
    return `match#${ this.id }`
  }

  public async setCompleted() {
    try {
      this.isCompleted = true
      const result = await this.save()
      console.log(result)

      return result
    } catch (e) {
      throw e
    }
  }
}
