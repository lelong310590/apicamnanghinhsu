import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'ContactsController.sendFeedback')
  Route.get('/','ContactsController.getFeedBackByType')
}
).prefix('feedback')
