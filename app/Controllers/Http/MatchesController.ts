import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Match from 'App/Models/Match'

export default class MatchesController {
  public async index ({}: HttpContextContract) {
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({ request }: HttpContextContract) {
    return await Match.findOrFail(request.param('id'))
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
