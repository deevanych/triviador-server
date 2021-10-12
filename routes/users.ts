import Route from '@ioc:Adonis/Core/Route'

Route.get('/users/', 'UsersController.index');
Route.get('/users/:id', 'UsersController.show');
