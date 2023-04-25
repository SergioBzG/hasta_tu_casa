import { test } from '@japa/runner'
import { getTokenAuthServiceProv } from './TestAuthServiceProv'

//Create offer
test('createOffer', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        price: 1300000,
        description: "Cleaning only",
        service: "Computing Repair",
        service_provider: "3149896767"
    }
    const response = await client.post('api/hastaTuCasa/createOffer').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('createOffer duplicate', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        price: 130000,
        description: "This is a full service",
        service: "Computing Repair",
        service_provider: "3149896767"
    }
    const response = await client.post('api/hastaTuCasa/createOffer').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('createOffer service o service prov. not found', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        price: 130000,
        description: "This is a full service",
        service: "Computing Repair",
        service_provider: "00000000"
    }
    const response = await client.post('api/hastaTuCasa/createOffer').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Get tests
test('getOffers', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/getOffers').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getOfferById', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/getOfferById/3').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getOfferById not found', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/getOfferById/1000').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Update tests
test('updateOffer', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        price: 130000,
        description: "Le dejo el jardin melo (test)",
    }
    const response = await client.put('api/hastaTuCasa/updateOffer/2').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('updateOffer invalid id', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        price: 130000,
        description: "Le dejo el jardin melo (test)",
    }
    const response = await client.put('api/hastaTuCasa/updateOffer/2000').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Delete offer
test('deleteOffer', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.delete('api/hastaTuCasa/deleteOffer/2').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('deleteOffer invalid id', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.delete('api/hastaTuCasa/deleteOffer/2000').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})