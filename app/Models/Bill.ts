 import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Purchase from './Purchase'

export default class Bill extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public payment_amount: number
  @column() public commission: number
  @column() public dibursed_amount: number
  @column() public purchase: number

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @belongsTo(() => Purchase)
  public purchases: BelongsTo<typeof Purchase>
}
