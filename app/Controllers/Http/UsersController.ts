import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index ({}: HttpContextContract): Promise<User[]> {
    const users = await User.query().preload('matches').exec()

    return users.sort((a, b) => b.rating - a.rating)
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({ request }) {
    return await User.findOrFail(request.param('id'))
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
