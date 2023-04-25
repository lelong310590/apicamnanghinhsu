import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public name: string

  @column()
  public permissions: string | null

  @column()
  public description: string | null

  @column()
  public isDefault: boolean

  @column()
  public createdBy: number | null

  @column()
  public updatedBy: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @manyToMany(() => User, {
    pivotTable: 'role_users'
  })
  public user: ManyToMany<typeof User>
}
