import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Purchase from './Purchase'
import Client from './Client'
import Offer from './Offer'

export default class Request extends BaseModel {
  @column({ isPrimary: true }) public request_code: number
  @column() public time_limit: number
  @column() public address: string
  @column() public comments: string
  @column() public state: string
  @column() public client: string

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @hasMany(() => Purchase, {
    localKey: 'request_code',
    foreignKey: 'request'
  })
  public purcahses: HasMany<typeof Purchase>

  @manyToMany(() => Offer,{
    pivotTable: 'purchase',
    localKey: 'request_code',
    pivotForeignKey: 'request',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'offer'
  })
  public offers: ManyToMany<typeof Offer>

  @belongsTo(() => Client)
  public clients: BelongsTo<typeof Client>
}
