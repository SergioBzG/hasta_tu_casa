import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'

//Get tests
test('getRequests', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getRequests').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getRequest by code', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getRequestByCode/2').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getRequest by code not found', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getRequestByCode/1000').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('getRequest by client', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getRequestByClient/3145644454').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('get offers from request', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getOffersByRequest/2').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('get offers from request, request not found', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getOffersByRequest/-1').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})