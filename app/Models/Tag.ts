import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'
import User from './User'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })

  @column()
  public id: number

  @column()
  public name: string

  @column()
  public authorId: number

  @column()
  public authorType: string

  @column()
  public description: string | null

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @manyToMany(() => Post,{
    pivotTable: 'post_tags'
  })
  public post: ManyToMany<typeof Post>

  @belongsTo(() => User,{
    foreignKey: "authorId"
  })
  public author: BelongsTo<typeof User>
}
