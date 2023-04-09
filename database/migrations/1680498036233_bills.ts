import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bills extends BaseSchema {
  protected tableName = 'bills'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.decimal('payment_amount', 20, 2).notNullable()
      table.decimal('commission', 2, 2).notNullable()
      table.decimal('dibursed_amount', 20, 2).notNullable()
      table.integer('purchase').unique().notNullable().references('id').inTable('purchases').onDelete('CASCADE')
      table.boolean('state').defaultTo(true)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
