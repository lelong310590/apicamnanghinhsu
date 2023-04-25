import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.raw('ALTER TABLE posts ADD FULLTEXT fulltext_index(content)')
  }

  public async down () {
    this.schema.raw('ALTER TABLE posts DROP INDEX fulltext_index')
  }
}
