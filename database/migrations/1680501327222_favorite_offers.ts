import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FavoriteOffers extends BaseSchema {
  protected tableName = 'favorite_offers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('client', 30).notNullable().references('phone').inTable('clients').onDelete('CASCADE')
      table.integer('offer').notNullable().references('id').inTable('offers').onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
