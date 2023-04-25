import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'

export default class PostsTranslation extends BaseModel {
  @column({ isPrimary: true })
  public postId: number

  @column()
  public langCode: string

  @column()
  public name: string | null

  @column()
  public description: string | null

  @column()
  public content: string | null


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @belongsTo(() => Post)
  public post: BelongsTo<typeof Post>
}
