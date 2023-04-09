import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Offer from './Offer'

export default class ServiceProvider extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public phone: string
  @column() public professional_profile: string
  @column() public document_number: string
  @column() public response_time: number
  @column() public unanswered_requests: number
  @column() public available: boolean
  @column() public income: number

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

 @belongsTo(() => User, {
  localKey: 'phone',
  foreignKey: 'phone'
 })
 public user: BelongsTo<typeof User>

 @hasMany(() => Offer,{
  localKey: 'phone',
  foreignKey: 'service_provider'
})
public offers: HasMany<typeof Offer>
}
