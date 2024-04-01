import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.get('/logout','UsersController.logout')
    Route.get('/delete-account','UsersController.deleteAccount')
  }).middleware('auth')
  Route.post('/login', 'UsersController.firebaseLogin')
  Route.patch('/update/:userId', 'UsersController.updateUser')
  Route.post('/login-zalo', 'UsersController.loginZalo')
}
).prefix('user')
