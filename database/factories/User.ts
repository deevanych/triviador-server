import User, { UserInterface } from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export const UserFactory = Factory
  .define(User, ({ faker }): UserInterface => {
    return {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      avatar_url: faker.image.avatar(),
      password: faker.internet.password(),
    }
  })
  .build()
