import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Offers extends BaseSchema {
  protected tableName = 'offers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.decimal('price', 20, 2).notNullable()
      table.json('comments')
      table.string('description', 255).notNullable()
      table.string('service', 255).notNullable().references('name').inTable('services').onDelete('CASCADE')
      table.string('service_provider', 30).notNullable().references('phone').inTable('service_providers').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
