import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'CategoriesController.getCat')
}
).prefix('category')
