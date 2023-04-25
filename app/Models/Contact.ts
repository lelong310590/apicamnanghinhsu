import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Contact extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string | null | undefined

  @column()
  public phone: string| null | undefined

  @column()
  public email: string| null | undefined

  @column()
  public address: string | null

  @column()
  public main: string

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
