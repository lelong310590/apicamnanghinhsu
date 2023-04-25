import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Tag from './Tag'

export default class TagsTranslation extends BaseModel {
  @column({ isPrimary: true })
  public tagsId: number

  @column()
  public langCode: string

  @column()
  public name: string

  @column()
  public description: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @belongsTo(() => Tag)
  public tag: BelongsTo<typeof Tag>
  
}
