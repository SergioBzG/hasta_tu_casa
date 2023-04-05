import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Purchases extends BaseSchema {
  protected tableName = 'purchases'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('offer').notNullable().references('id').inTable('offers').onDelete('CASCADE')
      table.integer('request').notNullable().references('request_code').inTable('requests').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
