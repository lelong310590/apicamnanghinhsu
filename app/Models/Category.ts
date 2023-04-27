import {DateTime} from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany, computed} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'

export default class Category extends BaseModel {
	@column({isPrimary: true})
	public id: number
	
	@column()
	public name: string
	
	@column()
	public parentId: number
	
	@column()
	public description: string | null
	
	@column()
	public status: string
	
	@column()
	public authorId: number
	
	@column()
	public authorType: string
	
	@column()
	public icon: string | null
	
	@column()
	public order: number
	
	@column()
	public isFeatured: number
	
	@column()
	public isDefault: number
	
	@column.dateTime({autoCreate: true})
	public createdAt: DateTime
	
	@column.dateTime({autoCreate: true, autoUpdate: true})
	public updatedAt: DateTime
  
    @computed()
    public get parent() {
        return this.parentId
    }
  
  //Declare Relationship
	
	@belongsTo(() => User, {
		foreignKey: "authorId"
	})
	public author: BelongsTo<typeof User>
	
	@manyToMany(() => Post, {
		pivotTable: 'post_categories'
	})
	public post: ManyToMany<typeof Post>
}
