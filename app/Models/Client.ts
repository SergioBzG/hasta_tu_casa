import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Request from './Request'
import Rating from './Rating'
import Offer from './Offer'

export default class Client extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public phone: string
  @column() public payment_method: string
  @column() public level: number

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'phone',
    foreignKey: 'phone'
  })
  public user: BelongsTo<typeof User>

  @manyToMany(() => Offer, {
    pivotTable: 'favorite_offers',
    localKey: 'phone',
    pivotForeignKey: 'client',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'offer'
  })
  public offers: ManyToMany<typeof Offer>

  @hasMany(() => Request, {
    localKey: 'phone',
    foreignKey: 'client'
  })
  public resquests: HasMany<typeof Request>

  @hasMany(() => Rating, {
    localKey: 'phone',
    foreignKey: 'client'
  })
  public ratings: HasMany<typeof Rating>
}
