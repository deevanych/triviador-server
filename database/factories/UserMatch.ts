import Factory from '@ioc:Adonis/Lucid/Factory'
import UserMatch, { POINTS_AMOUNTS, UserMatchInterface } from 'App/Models/UserMatch'
import { CREATED_USERS_COUNT } from 'Database/seeders/User'
import { CREATED_MATCHES_COUNT } from 'Database/seeders/Match'

export const UserMatchFactory = Factory
  .define(UserMatch, ({ faker }): UserMatchInterface => {
    return {
      amount: POINTS_AMOUNTS[faker.datatype.number({ min: 0, max: POINTS_AMOUNTS.length - 1 })],
      matchId: faker.datatype.number({ min: 1, max: CREATED_MATCHES_COUNT }),
      userId: faker.datatype.number({ min: 1, max: CREATED_USERS_COUNT }),
    }
  })
  .build()
