import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import Offer from './Offer'

export default class Rating extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public efficiency: number
  @column() public efficacy: number
  @column() public customer_service: number
  @column() public client: string
  @column() public offer: number
  @column() public state: boolean

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @belongsTo(() => Client)
  public clients: BelongsTo<typeof Client>

  @belongsTo(() => Offer)
  public offers: BelongsTo<typeof Offer>
}
