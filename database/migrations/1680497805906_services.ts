import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Services extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).unique().notNullable()
      table.string('category', 255).notNullable()
      table.decimal('commission', 2, 2).notNullable()
      table.timestamps(true)

    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
