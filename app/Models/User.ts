import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string | null

  @column.dateTime()
  public emailVerifiedAt: DateTime | null

  @column({serializeAs: null})
  public password: string

  @column()
  public phone: string

  @column()
  public rememberToken: string | null

  @column()
  public firstName: string | null

  @column()
  public lastName: string | null

  @column()
  public userName: string | null

  @column()
  public superUser: boolean

  @column()
  public manageSupers: boolean

  @column()
  public permissions: string

  @column.dateTime()
  public lastLogin: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  //declare relationship
  @manyToMany(() => Role, {
    pivotTable:'role_users'
  })
  public role: ManyToMany<typeof Role>
}
