import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Offer from './Offer'
import Purchase from './Purchase'

export default class Request extends BaseModel {
  @column({ isPrimary: true }) public request_code: number
  @column() public time_limit: number
  @column() public address: string
  @column() public comments: string
  @column() public date: Date
  @column() public client: string

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @manyToMany(() => Offer,{
    pivotTable: 'purchases',
    localKey: 'request_code',
    pivotForeignKey: 'request',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'offer'
  })
  public offers: ManyToMany<typeof Offer>

  @hasMany(() => Purchase, {
    localKey: 'request_code',
    foreignKey: 'request'
  })
  public purchases: HasMany<typeof Purchase>

  @belongsTo(() => Client, {
    localKey: 'phone',
    foreignKey: 'client'
  })
  public clients: BelongsTo<typeof Client>
}
