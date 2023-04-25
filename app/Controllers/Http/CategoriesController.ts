import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import ResponseFormat from 'App/utils/ResponseFormat'

export default class CategoriesController {
  public async getCat({request, response}:HttpContextContract){
    const page = parseInt(request.input('page',1))
    const limit = parseInt(request.input('limit', 10))
    const category = await Category.query().select('*').paginate(page, limit)
    if(category.length != 0){
      return response.status(200).json(
        new ResponseFormat(
          category,
          true,
          "Lấy thông tin toàn bộ chủ đề thành công"
        )
      )
    }
  }
}
