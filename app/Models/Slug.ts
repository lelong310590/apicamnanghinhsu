import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Slug extends BaseModel {
  @column({ isPrimary: true })

  @column()
  public id: number

  @column()
  public key: string

  @column()
  public referenceId: number

  @column()
  public referenceType: string

  @column()
  public prefix: string | null
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
