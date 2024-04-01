import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import ResponseFormat from 'App/utils/ResponseFormat'
import * as Admin from 'firebase-admin/auth'
import * as App from 'firebase-admin'
import {ServiceAccount} from 'firebase-admin'
import Database from '@ioc:Adonis/Lucid/Database'
import serviceAccount from '../../utils/serviceAccountKey.json'
import fetch from 'node-fetch'
import {schema} from "@ioc:Adonis/Core/Validator";

const converted_serviceAccount = serviceAccount as ServiceAccount
const app = App.initializeApp({ credential: App.credential.cert(converted_serviceAccount) })

export default class UsersController {

  public async loginZalo({request, response, auth}: HttpContextContract) : Promise<void> {
    const secretKey: string = 'F2sKY2B8WI8Z8H4TIGnG';
    const url: string = `https://graph.zalo.me/v2.0/me/info`

    const validateSchema = schema.create({
      token: schema.string.optional(),
      accessToken: schema.string.optional(),
    })

    const payload: Record<string, any> = await request.validate({
      schema: validateSchema,
    })

    const {token, accessToken} = payload

    const options = {
      method: 'get',
      headers: {
        access_token: accessToken,
        code: token,
        secret_key: secretKey,

      }
    }
    const loginRequest = await fetch(url, options)
    if (loginRequest.error === 0) {
      // register
      const createUser = new User()
      createUser.phone = this.convertPhoneNumber(loginRequest.data.number)
      await createUser.save()
      const token = await auth.use('api').generate(createUser)
      return response.status(201).json(
        {
          data: {userData:createUser,token:token},
          isMissingUserInfo: true,
          success: true,
          message:"Tạo tài khoản mới thành công, cần update thông tin"
        }
      )
    } else {
      return response.status(400).json({
        success: false,
        message:"Lỗi khi đăng nhập"
      })
    }
  }

  public async updateUser({request, response, params}:HttpContextContract){
    const userId = parseInt(params.userId)
    const firstName = request.input('firstName')
    const lastName = request.input('lastName')
    try{
      const user = await User.findOrFail(userId)
      user.lastName = lastName
      user.firstName = firstName
      await user.save()
      return response.status(200).json(
        new ResponseFormat(
          user,
          true,
          'Cập nhật user thành công'
        )
      )
    }
    catch(err){
      return response.status(200).json(
        new ResponseFormat(
          err,
          false,
          'Có lỗi khi update user'
        )
      )
    }
  }

  public async firebaseLogin({request, response, auth}: HttpContextContract){
    const uid = request.input('uid')
    try{
      const getAuth = await Admin.getAuth(app).getUser(uid)
      const user = getAuth.toJSON()
      const userPhone = user['phoneNumber'].replace('+84', '0')
      if(userPhone){
        const userData = await User.findBy('phone', userPhone)
        if (userData) {
          const token = await auth.use('api').generate(userData)
          if(userData.lastName == null){
            return response.status(200).json(
              {
                data: {userData:userData,token:token},
                isMissingUserInfo: true,
                success: true,
                message:"Cần update thông tin"
              }
            )
          }
          return response.status(200).json(
            {
              data: {userData:userData,token:token},
              isMissingUserInfo: false,
              success: true,
              message:"Đăng nhập thành công"
            }
          )
        }
        else{
          const createUser = new User()
          createUser.phone = userPhone
          await createUser.save()
          const token = await auth.use('api').generate(createUser)
          return response.status(201).json(
            {
              data: {userData:createUser,token:token},
              isMissingUserInfo: true,
              success: true,
              message:"Tạo tài khoản mới thành công, cần update thông tin"
            }
          )
        }
      }
    }
    catch (err) {
      return response.status(400).json(err)
    }
  }

  public async logout({response, auth}){
    //revoke token
    const userId = await auth.use('api').user.id
    await auth.use('api').revoke()
    await Database.from('api_tokens').delete().where('user_id', userId)
    return response.status(200).send(
      new ResponseFormat(
        true,
        true,
        "Đăng xuất thành công"
      )
    )
  }
  public async deleteAccount({response, auth}: HttpContextContract){
    const user = await auth.use('api').user
    if(user){
      const userData = await User.find(user.id)
      if(userData){
        return response.status(200).json(
          new ResponseFormat(
            userData,
            true,
            'Xóa tài khoản thành công, tài khoản của bạn sẽ được xóa trong 30 ngày'
          )
        )
      }
    }
  }

  public convertPhoneNumber(number) {
    // Convert number to string
    let strNumber = number.toString();

    // Remove the first two characters if they are '84'
    if (strNumber.slice(0, 2) === '84') {
      strNumber = strNumber.slice(2);
    }

    // Prepend '0' to the number
    strNumber = '0' + strNumber;

    // Return the converted number
    return strNumber;
  }
}
