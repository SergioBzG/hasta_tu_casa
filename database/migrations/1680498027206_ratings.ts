import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ratings extends BaseSchema {
  protected tableName = 'ratings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('efficiency').notNullable()
      table.integer('efficacy').notNullable()
      table.integer('customer_service').notNullable()
      table.string('client', 30).notNullable().references('phone').inTable('clients').onDelete('CASCADE')
      table.integer('offer').notNullable().references('id').inTable('offers').onDelete('CASCADE')
      table.boolean('state').defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
