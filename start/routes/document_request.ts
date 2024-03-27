import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
	Route.post('/', 'DocumentRequestController.postRequest')
}
).prefix('document-request')
