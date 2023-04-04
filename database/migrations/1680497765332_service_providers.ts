import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ServiceProviders extends BaseSchema {
  protected tableName = 'service_providers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('phone', 30).unique().notNullable().references('phone').inTable('users').onDelete('CASCADE')
      table.string('professional_profile', 255).notNullable()
      table.string('document_number', 255).notNullable()
      table.integer('response_time').notNullable().defaultTo(0)
      table.integer('unanswered_requests').defaultTo(0)
      table.boolean('available').notNullable().defaultTo(true)
      table.decimal('income', 20, 2).notNullable().defaultTo(0)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
