import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import ResponseFormat from 'App/utils/ResponseFormat'
import Database from '@ioc:Adonis/Lucid/Database'

let result = []

function sortItems(arr, parentId = 0) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].parent === parentId) {
			let parentItem = result.find(item => item.id === parentId)
			
			if (parentItem !== undefined) {
				const currentItem = arr[i]
				let childrens = []
				childrens.push(currentItem)
				const newParent = {
					...parentItem,
					child: childrens
				}
				
				const index = result.findIndex(item => item.id === newParent.id);
				
				if (index !== -1) {
					result[index] = newParent
				}
				
			} else {
				result.push(arr[i])
			}
			
			sortItems(arr, arr[i].id)
		}
	}
	
	return result
}


export default class CategoriesController {
	public async getCat({request, response}: HttpContextContract) {
		const category = await Category.query()
			.select([
				'name', 'id', 'parent_id'
			])
			.where('status', "published")
			.exec()
		
		if (category.length != 0) {
			// const sortedArr = sortItems(category)

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
