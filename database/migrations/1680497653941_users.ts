import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('id').primary()
      table.string('phone', 30).unique().notNullable()
      table.string('name', 255).notNullable()
      table.string('password', 255).notNullable()
      table.string('email', 255).notNullable()
      table.string('address', 255).notNullable()
      table.boolean('state').notNullable().defaultTo(true)
      table.string('bank_account', 255)
      table.enum('role', ['Admin', 'Client', 'ServiceProvider']).notNullable()
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
