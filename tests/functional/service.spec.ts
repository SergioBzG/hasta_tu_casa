import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'
import { getTokenAuthClient } from './TestAuthClient'

//Create tests
test('createService', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const body = {
        name: "Plumbing",
        category: "Home",
        commission: 0.10
    }
    const response = await client.post('api/hastaTuCasa/createService').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('createService invalid name', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const body = {
        name: "Plumbing",
        category: "Home",
        commission: 0.10
    }
    const response = await client.post('api/hastaTuCasa/createService').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('createService fail', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const body = { }
    const response = await client.post('api/hastaTuCasa/createService').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Get tests
test('getServices', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/getServices').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getService by name', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/getServiceByName/Hair Salon').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getService by name not found', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/getServiceByName/Indriver').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Update tests
test('updateService', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const body = {
        name: "Manicure",
        category: "Beauty",
        commission: 0.14
    }
    const response = await client.put('api/hastaTuCasa/updateService/4').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('updateService inlvalid id', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const body = {
        name: "Manicure",
        category: "Beauty",
        commission: 0.14
    }
    const response = await client.put('api/hastaTuCasa/updateService/1000').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('updateService inlvalid name', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const body = {
        name: "Gardening",
        category: "Beauty",
        commission: 0.14
    }
    const response = await client.put('api/hastaTuCasa/updateService/4').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Delete tests
test('deleteService', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.delete('api/hastaTuCasa/deleteService/4').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('deleteService invalid id', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.delete('api/hastaTuCasa/deleteService/1000').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})