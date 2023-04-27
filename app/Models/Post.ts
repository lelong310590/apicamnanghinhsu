import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Type from './Type'
import Category from './Category'
import Tag from './Tag'
import Slug from './Slug'

export default class Post extends BaseModel {
    @column({isPrimary: true})
    public id: number

    @column()
    public name: string

    @column()
    public description: string | null

    @column()
    public content: string | null

    @column()
    public status: string

    @column()
    public authorId: number

    @column()
    public isFeatured: number

    @column()
    public image: string | null

    @column()
    public views: number

    @column()
    public formatType: string | null

    @column()
    public typeId: number

    @column()
    public nextId: number | undefined | null

    @column()
    public prevId: number | undefined | null

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime

    @column.dateTime()
    public releaseDate: DateTime

    @column.dateTime()
    public effectDate: DateTime

    //declare relationship
    @belongsTo(() => User, {
        foreignKey: 'authorId'
    })
    public author: BelongsTo<typeof User>

    @belongsTo(() => Type)
    public type: BelongsTo<typeof Type>

    @manyToMany(() => Category, {
        pivotTable: 'post_categories'
    })
    public category: ManyToMany<typeof Category>

    @manyToMany(() => Tag, {
        pivotTable: 'post_tags'
    })
    public tag: ManyToMany<typeof Tag>

    @hasOne(() => Slug, {
        foreignKey: 'referenceId'
    })
    public slug: HasOne<typeof Slug>
}
