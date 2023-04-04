import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'
import ServiceProvider from './ServiceProvider'
import Rating from './Rating'

export default class Offer extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public price: number
  @column() public comments: JSON
  @column() public description: string
  @column() public service: string
  @column() public service_provider: string

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @belongsTo(() => Service)
  public services: BelongsTo<typeof Service>
  
  @belongsTo(() => ServiceProvider)
  public serviceProvider: BelongsTo<typeof ServiceProvider>

  @hasMany(() => Rating, {
    localKey: 'id',
    foreignKey: 'offer'
  })
  public ratings: HasMany<typeof Rating>
}
