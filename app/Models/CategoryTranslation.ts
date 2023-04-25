import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'

export default class CategoryTranslation extends BaseModel {

  @column()
  public langCode: string

  @column({isPrimary: true})
  public categoriesId: number

  @column()
  public name: string

  @column()
  public description: string| null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //Declare relationship
  @belongsTo(() => Category, {
    foreignKey: 'categoriesId'
  })
  public category: BelongsTo<typeof Category>
}
