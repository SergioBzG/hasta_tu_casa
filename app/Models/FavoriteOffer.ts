import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Offer from './Offer'
import Client from './Client'

export default class FavoriteOffer extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public client: string
  @column() public offer: number

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @belongsTo(() => Offer, {
    localKey: 'id',
    foreignKey: 'offer'
  })
  public offers: BelongsTo<typeof Offer>

  @belongsTo(() => Client, {
    localKey: 'phone',
    foreignKey: 'client'
  })
  public clients: BelongsTo<typeof Client>
}
