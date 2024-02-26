import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

import ResponseFormat from 'App/utils/ResponseFormat'
import Database from '@ioc:Adonis/Lucid/Database'

function sortArrayByParent(arr, parent_id) {
	let result: any[] = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].parent_id === parent_id) {
			let children = sortArrayByParent(arr, arr[i].id);
			if (children.length > 0) {
				arr[i].child = children;
			}
			result.push(arr[i]);
		}
	}
	return result;
}


export default class CategoriesController {
	public async getCat({response}: HttpContextContract) {
		const category = await Database
			.query()  // 👈 gives an instance of select query builder
			.from('categories')
			.select('id', 'name', 'parent_id')
		
		if (category.length != 0) {
			const sortedArr = sortArrayByParent(category, 0);

			return response.status(200).json(
				new ResponseFormat(
					sortedArr,
					true,
					"Lấy thông tin toàn bộ chủ đề thành công"
				)
			)
		}
	}
}
