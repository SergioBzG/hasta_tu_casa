import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Clients extends BaseSchema {
  protected tableName = 'clients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('phone', 30).unique().notNullable().references('phone').inTable('users').onDelete('CASCADE')
      table.string('payment_method', 100).notNullable()
      table.integer('level', 10).notNullable().defaultTo(0)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
