import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Type extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string | null

  @column()
  public status: string

  @column()
  public authorId: number

  @column()
  public authorType: string

  @column()
  public isDefault: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @belongsTo(() => User,{
    foreignKey: 'authorId'
  })
  public author: BelongsTo<typeof User>
}
