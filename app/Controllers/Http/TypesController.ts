import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Type from 'App/Models/Type'
import ResponseFormat from 'App/utils/ResponseFormat'

export default class TypesController {
  public async getTypes({response}:HttpContextContract){
    const types = await Type.all()
    return response.status(200).json(
      new ResponseFormat(
        types,
        true,
        'Lấy thông tin all type thành công'
      )
    )
  }
}
