import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'
import ServiceProvider from './ServiceProvider'
import Admin from './Admin'

export default class User extends BaseModel {
  @column({ isPrimary: true }) public id: number
  @column() public phone: string
  @column() public name: string
  @column() public password: string
  @column() public email: string
  @column() public address: string
  @column() public state: boolean
  @column() public bank_account: string
  @column() public role: string

  @column.dateTime({ autoCreate: true }) public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true }) public updatedAt: DateTime

  @hasOne(() => Client, {
    localKey: 'phone',
    foreignKey: 'phone'
  })
  public client: HasOne<typeof Client>

  @hasOne(() => ServiceProvider, {
    localKey: 'phone',
    foreignKey: 'phone'
  })
  public serviceProvider: HasOne<typeof ServiceProvider>

  @hasOne(() => Admin, {
    localKey: 'phone',
    foreignKey: 'phone'
  })
  public admin: HasOne<typeof Admin>
}
