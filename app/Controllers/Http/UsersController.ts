import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ResponseFormat from 'App/utils/ResponseFormat'
import * as Admin from 'firebase-admin/auth'
import * as App from 'firebase-admin'
import {ServiceAccount} from 'firebase-admin'
import Database from '@ioc:Adonis/Lucid/Database'
import serviceAccount from '../../utils/serviceAccountKey.json'
import fetch from 'node-fetch'
import {schema} from "@ioc:Adonis/Core/Validator";
import Member from "App/Models/Member";

const converted_serviceAccount = serviceAccount as ServiceAccount
const app = App.initializeApp({ credential: App.credential.cert(converted_serviceAccount) })

export default class UsersController {

  /**
   *
   * @param response
   * @param auth
   */
  public async info({response, auth}: HttpContextContract): Promise<void> {
    const user: Member = auth.use('member').user!

    return response.ok({
      responseCode: 200,
      error: false,
      msg: 'Get user success',
      data: user,
    })
  }

  public async loginZalo({request, response, auth}: HttpContextContract) : Promise<void> {
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
        secret_key: 'F2sKY2B8WI8Z8H4TIGnG',
      }
    }
    const loginRequest = await fetch(url, options)
    const loginResponse = await loginRequest.json()

    if (loginResponse.error === 0) {
      // register
      const userPhone = this.convertPhoneNumber(loginResponse.data.number)
      const createUser = await Member.updateOrCreate({phone: userPhone}, {phone: userPhone})
      const token = await auth.use('member').generate(createUser, {
        expiresIn: '30 days',
      })
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
      const user: Member = await Member.findOrFail(userId)
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

    const getAuth = await Admin.getAuth(app).getUser(uid)

    const user = getAuth.toJSON()
    const userPhone = user['phoneNumber']
    const userEmail = user['email'];

    try{
      if(userPhone || userEmail){
        const userQuery = Member.query();

        if (userPhone) {
          const phoneNumber = userPhone.replace('+84', '0')
          userQuery.orWhere('phone', phoneNumber)
        }

        if (userEmail) {
          userQuery.orWhere('email', userEmail)
        }

        const userData: Member | null = await userQuery.first()

        if (userData) {
          const token = await auth.use('member').generate(userData, {
            expiresIn: '30 days',
          })
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
          const createUser = new Member()

          if (userPhone) {
            createUser.phone = userPhone
          }

          if (userEmail) {
            createUser.email = userEmail
          }

          await createUser.save()
          const token = await auth.use('member').generate(createUser, {
            expiresIn: '30 days',
          })
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
    const userId = await auth.use('member').user.id
    await auth.use('member').revoke()
    await Database.from('member_api_tokens').delete().where('member_id', userId)
    return response.status(200).send(
      new ResponseFormat(
        true,
        true,
        "Đăng xuất thành công"
      )
    )
  }
  public async deleteAccount({response, auth}: HttpContextContract){
    const user = await auth.use('member').user
    if(user){
      const userData = await Member.find(user.id)
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
