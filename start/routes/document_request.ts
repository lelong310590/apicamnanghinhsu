import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
	Route.post('/', 'DocumentRequestsController.postRequest')
}
).prefix('document-request')
