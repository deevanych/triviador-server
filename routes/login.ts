import Route from '@ioc:Adonis/Core/Route'

Route.post('login', 'AuthController.login')
  .as('login')
Route.get('auth', 'AuthController.getAuthUser')
  .as('getAuthUser')
  .middleware('auth')
