import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules, schema} from "@ioc:Adonis/Core/Validator";
import Contact from "App/Models/Contact";
import ResponseFormat from "App/utils/ResponseFormat";

export default class DocumentRequestsController {
	public async postRequest({request, response}: HttpContextContract) : Promise<void> {
		const validateSchema = schema.create({
			userId: schema.number.optional(),
			org: schema.string.optional(),
			main: schema.string(),
			email: schema.string.optional([rules.email()]),
			telegram: schema.string.optional(),
		})

		const payload: Record<string, any> = await request.validate({
			schema: validateSchema,
		})

		const {org, main, email, telegram, userId} = payload

		const requestDocument: Contact = await Contact.create({
			org, main, email, telegram, userId
		})

		return response.status(200).json(
			new ResponseFormat(
				requestDocument,
				true,
				"Tạo yêu cầu thành công !"
			)
		)
	}
}
