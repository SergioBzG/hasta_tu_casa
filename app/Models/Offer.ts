import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Service from './Service'
import ServiceProvider from './ServiceProvider'
import Rating from './Rating'
import Request from './Request'

export default class Offer extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public price: number
  @column() public comments: JSON
  @column() public description: string
  @column() public service: string
  @column() public service_provider: string
  @column() public state: boolean

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @belongsTo(() => Service, {
    localKey: 'name',
    foreignKey: 'service'
  })
  public services: BelongsTo<typeof Service>
  
  @belongsTo(() => ServiceProvider, {
    localKey: 'phone',
    foreignKey: 'service_provider'
  })
  public serviceProvider: BelongsTo<typeof ServiceProvider>

  @hasMany(() => Rating, {
    localKey: 'id',
    foreignKey: 'offer'
  })
  public ratings: HasMany<typeof Rating>

  @manyToMany(() => Request,{
    pivotTable: 'purchases',
    localKey: 'id',
    pivotForeignKey: 'offer',
    relatedKey: 'request_code',
    pivotRelatedForeignKey: 'request'
  })
  public requests: ManyToMany<typeof Request>
}
