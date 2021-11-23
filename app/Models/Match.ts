import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import {
  afterCreate,
  afterFind,
  BaseModel,
  column,
  computed,
  hasMany,
  HasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User, { INITIAL_RATING } from 'App/Models/User'
import MatchStage, {
  DEFINING_ROUND_COUNT,
  DEFINING_TYPE,
  INITIAL_TYPE,
  MatchStageInterface,
} from 'App/Models/MatchStage'

export default class Match extends BaseModel {
  @afterFind()
  public static async afterFindHook(match: Match) {
    await match.load('users')
  }

  @afterCreate()
  public static async afterCreateHook(match: Match) {
    await Event.emit('new:match', match)
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
    pivotColumns: ['amount', 'in_match']
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => MatchStage)
  public stages: HasMany<typeof MatchStage>

  @computed()
  public get getRoom(): string {
    return `match#${ this.id }`
  }

  public async setCompleted(): Promise<void> {
    try {
      this.isCompleted = true
      await this.save()
    } catch (e) {
      throw e
    }
  }

  public async generateStages() {
    const matchId = this.id
    const sortedPlayers = this.users.sort((a: User, b: User) => {
      const ratingA = a.rating ?? INITIAL_RATING
      const ratingB = b.rating ?? INITIAL_RATING

      return ratingB - ratingA
    })

    const playersIds = sortedPlayers.map((user) => user.id)
    const stages: number[] = []
    const stagesArray: MatchStageInterface[] = []
    let temporary = [...playersIds]

    stages.push(...temporary)

    for (let i = 0; i < playersIds.length - 1; i++) {
      const firstPlayer = temporary.shift() as number
      temporary.push(firstPlayer)
      stages.push(...temporary)
    }

    stagesArray.push({
      matchId,
      type: INITIAL_TYPE
    })

    for (let i = 0; i < DEFINING_ROUND_COUNT; i++) {
      stagesArray.push({
        matchId,
        type: DEFINING_TYPE
      })
    }

    stagesArray.push(...stages.map((userId) => {
      return {
        userId,
        matchId
      }
    })
    )

    await MatchStage.createMany(stagesArray)
  }
}
