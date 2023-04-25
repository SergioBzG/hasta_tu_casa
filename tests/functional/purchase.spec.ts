import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'

//Get tests
test('getPurchases', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getPurchases').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getPurchase by id', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getPurchaseById/5').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getPurchase invalid id', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getPurchaseById/-1').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('getPurchase by state', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getPurchaseByState/pending').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getBillPurchase', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getPurchaseByState/4').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

