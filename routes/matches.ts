import Route from '@ioc:Adonis/Core/Route'

Route.resource('matches', 'MatchesController')
  .as('matches')
  .only(['index', 'show'])
  .apiOnly()
