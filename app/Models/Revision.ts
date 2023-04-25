import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Revision extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public revisionableType : string

  @column()
  public revisionableId : number

  @column()
  public userId: number | null

  @column()
  public key: string

  @column()
  public oldValue: string | null

  @column()
  public newValue: string | null


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @belongsTo(() => User)
  public user:BelongsTo<typeof User>
}
