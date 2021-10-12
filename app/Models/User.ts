import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

const defaultUserAvatar = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_640.png'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nickname: string

  @column({ serializeAs: null })
  public email: string

  @column({
    serialize: (avatarUrl: string | null) => avatarUrl ?? defaultUserAvatar,
  })
  public avatar_url: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
