import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Requests extends BaseSchema {
  protected tableName = 'requests'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('request_code')
      table.integer('time_limit').notNullable()
      table.string('address', 255).notNullable()
      table.string('comments', 255)
      table.date('date').notNullable()
      table.string('client', 30).notNullable().references('phone').inTable('clients').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
