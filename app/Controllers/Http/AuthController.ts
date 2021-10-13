import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login ({}: HttpContextContract): Promise<string> {
    return 'we'
  }
}
