import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/','PostsController.getPost')
  Route.get('/news', 'PostsController.getTop5Post')
  Route.get('/detail','PostsController.getPostDetails')
  Route.get('/next-post/:id', 'PostsController.getNextPost')
  Route.get('/previous-post/:id', 'PostsController.getPreviousPost')
  Route.get('/search','PostsController.searchPost')
  Route.get('/category',"PostsController.getPostsByCategory")
  Route.get('/type',"PostsController.getPostsByType")
  Route.get('/tag',"PostsController.getPostsByTag")

}
).prefix('post')
