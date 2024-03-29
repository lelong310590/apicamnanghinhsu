import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Slug from "App/Models/Slug";

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public content: string | null

  @column()
  public userId: number

  @column()
  public image: string | null

  @column()
  public template: string | null

  @column()
  public isFeatured: number

  @column()
  public description: string | null

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => Slug, {
    foreignKey: 'referenceId'
  })
  public slug: HasOne<typeof Slug>

}
