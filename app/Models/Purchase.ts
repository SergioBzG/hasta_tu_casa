import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Offer from './Offer'
import Request from './Request'
import Bill from './Bill'

export default class Purchase extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public state: string
  @column() public offer: number
  @column() public request: number

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @belongsTo(() => Offer,{
    localKey: 'id',
    foreignKey: 'offer'
  })
  public offers: BelongsTo<typeof Offer>

  @belongsTo(() => Request,{
    localKey: 'request_code',
    foreignKey: 'request'
  })
  public requests: BelongsTo<typeof Request>

  @hasOne(() => Bill, {
    localKey: 'id',
    foreignKey: 'purchase'
  })
  public bill: HasOne<typeof Bill>
}
