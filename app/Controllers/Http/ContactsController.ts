import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema as Schema} from '@ioc:Adonis/Core/Validator'
import Contact from 'App/Models/Contact'
import ResponseFormat from 'App/utils/ResponseFormat'

export default class ContactsController {

  public async sendFeedback({request, response}:HttpContextContract){
    const validator = Schema.create({
      name: Schema.string.nullableAndOptional({trim: true}),
      phone: Schema.string.nullableAndOptional([
        rules.mobile()
      ]),
      email: Schema.string.nullableAndOptional([
        rules.email(),
        rules.normalizeEmail({
          allLowercase: true,
          gmailRemoveDots:true,
          gmailRemoveSubaddress: true
        }),
        rules.trim()
      ]),
      address: Schema.string.nullableAndOptional([
        rules.trim()
      ]),
      main: Schema.string([
        rules.trim()
      ])
    })
    const data = await request.validate({schema: validator})
    const feedback = new Contact()
    const type = request.input('type',"Góp ý")
    try{
      await feedback.merge({type:type,...data}).save()
      return response.status(201).json(
        new ResponseFormat(
          feedback,
          true,
          "Gửi feedback thành công"
        )
      )
    }
    catch(err){
      return response.status(200).json(
        new ResponseFormat(
          err,
          false,
          "Gửi feedback thất bại"
        )
      )
    }
  }

  public async getFeedBackByType({request, response}: HttpContextContract){
    const type = request.input('type')
    const feedback = await Contact.query().select("*").where('type', type).orderBy('created_at','desc')
    return response.status(200).json(
      new ResponseFormat(
        feedback,
        true,
        "Get all feedback thành công"
      )
    )
  }
}
