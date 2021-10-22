import { DateTime } from 'luxon'
import { afterFind, BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Match from 'App/Models/Match'

const DEFAULT_USER_AVATAR = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png'
const INITIAL_RATING = 100

// todo
// change matches getters
// change active match getter

export interface UserInterface {
  id?: number,
  nickname: string,
  email: string,
  avatar_url: string,
  password: string,
  readonly rating?: number,
}

export default class User extends BaseModel implements UserInterface {
  @afterFind()
  public static async afterFindHook(user: User) {
    await user.load('matches')
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public nickname: string

  @column({ serializeAs: null })
  public email: string

  @column({
    serialize: (avatarUrl: string | null) => avatarUrl ?? DEFAULT_USER_AVATAR,
  })
  public avatar_url: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Match, {
    pivotTable: 'user_matches',
    pivotColumns: ['amount', 'in_match'],
    serializeAs: null
  })
  public matches: ManyToMany<typeof Match>

  @computed()
  public get rating(): number {
    return this.matches.reduce((sum: number, match: Match) => {
      return sum + match.$extras.pivot_amount
    }, INITIAL_RATING)
  }

  @computed()
  public get activeMatch(): Match | undefined {
    return this.matches.find((match: Match): boolean => match.$extras.pivot_in_match)
  }

  @computed()
  public get isInMatch(): boolean {
    return typeof this.activeMatch !== 'undefined'
  }

  public leaveMatch(): void {
    this.activeMatch?.related('users').sync({
      [this.id]: {
        in_match: false,
      },
    })
  }
}
