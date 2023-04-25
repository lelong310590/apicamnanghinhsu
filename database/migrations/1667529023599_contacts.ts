import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('type').defaultTo("Góp ý")
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type')
    })
  }
}
