import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Member extends BaseModel {

  public static table: string = 'members';

  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string | null

  @column()
  public lastName: string | null

  @column()
  public email: string

  @column()
  public phone: string

  @column()
  public type: number

  @column()
  public numberLoggedIn: number

  @column.dateTime()
  public vipExpiresAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
