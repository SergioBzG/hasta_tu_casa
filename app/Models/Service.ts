import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Offer from './Offer'

export default class Service extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public name: string
  @column() public category: string
  @column() public commission: number
  @column() public state: boolean

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @hasMany(() => Offer,{
    localKey: 'name',
    foreignKey: 'service'
  })
  public oferrs: HasMany<typeof Offer>
}
