import Database from '@ioc:Adonis/Lucid/Database'
import { tableName as usersTableName } from 'Database/migrations/1633877446031_users'
import { tableName as tokensTableName } from 'Database/migrations/1633877456031_api_tokens'
import { AuthService } from 'App/Services/AuthService'
import User from 'App/Models/User'


export async function getUserByToken(token): Promise<User> {
  const parsedToken = AuthService.parseToken(token)

  const result = await Database.query()
    .from(usersTableName)
    .where(
      'id',
      Database
        .from(tokensTableName)
        .select('user_id')
        .where('id', parsedToken.tokenId)
        .where('token', parsedToken.token)
        .limit(1)
    ).firstOrFail()

  return User.findOrFail(result.id)
}
