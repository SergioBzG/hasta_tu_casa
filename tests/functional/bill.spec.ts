import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'

//Get tests
test('getBills', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getBills').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getBill by purchase', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getBillByPurchase/4').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getBill by purchase not found', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getBillByPurchase/-1').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})