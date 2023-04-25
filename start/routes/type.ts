import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'TypesController.getTypes')
}
).prefix('type')
