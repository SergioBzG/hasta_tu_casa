import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'
import { getTokenAuthClient } from './TestAuthClient'

//Create tests
test('createClient', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        phone: "3809033353",
        name: "Gorilla",
        email: "gor@unal.edu.co",
        password: "gor",
        address: "Monteria",
        payment_method: "Cash" 
    }
    const response = await client.post('api/hastaTuCasa/client/createClient').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('createClient invalid phone', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        phone: "3809033353",
        name: "Gorilla",
        email: "gor@unal.edu.co",
        password: "gor",
        address: "Monteria",
        payment_method: "Cash" 
    }
    const response = await client.post('api/hastaTuCasa/client/createClient').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('createClient invalid email', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        phone: "3809033300",
        name: "Gorilla",
        email: "gor@unal.edu.co",
        password: "gor",
        address: "Monteria",
        payment_method: "Cash" 
    }
    const response = await client.post('api/hastaTuCasa/client/createClient').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('createClient fail', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = { }
    const response = await client.post('api/hastaTuCasa/client/createClient').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Get tests
test('getClients', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/client/getClients').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getClient by email', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/client/getClientByEmail/ama@unal.edu.co').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getClient by email no found', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/client/getClientByEmail/rosa@unal.edu.co').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Update tests
test('updateClient', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        name: "Carlos",
        email: "carlos@unal.edu.co",
        password: "carlos",
        address: "CL 68 # 51b-31",
        bank_account: null,
        state: true,
        payment_method: "Card",
        level: 3
    }
    const response = await client.put('api/hastaTuCasa/client/updateClient/3').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('updateClient invalid id', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        name: "Carlos",
        email: "carlos@unal.edu.co",
        password: "carlos",
        address: "CL 68 # 51b-31",
        bank_account: null,
        state: true,
        payment_method: "Card",
        level: 3
    }
    const response = await client.put('api/hastaTuCasa/client/updateClient/-2').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('updateClient user not found', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        name: "Carlos",
        email: "carlos@unal.edu.co",
        password: "carlos",
        address: "CL 68 # 51b-31",
        bank_account: null,
        state: true,
        payment_method: "Card",
        level: 3
    }
    const response = await client.put('api/hastaTuCasa/client/updateClient/7').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('updateClient invalid email', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        name: "Carlos",
        email: "cass@unal.edu.co",
        password: "carlos",
        address: "CL 68 # 51b-31",
        bank_account: null,
        state: true,
        payment_method: "Card",
        level: 3
    }
    const response = await client.put('api/hastaTuCasa/client/updateClient/3').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Make request
test('makeRequest', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        time_limit: 5200,
        address: "CR 80 CL #45 Test",
        comments: "",
        date: "2023-07-21",
        offers: [4]
    }
    const response = await client.post('api/hastaTuCasa/client/makeRequest').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('makeRequest invalid offer', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        time_limit: 5200,
        addres: "CR 80 CL #45",
        comments: "",
        date: "2023-07-21",
        offers: [2000]
    }
    const response = await client.post('api/hastaTuCasa/client/makeRequest').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('makeRequest request fail', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = { }
    const response = await client.post('api/hastaTuCasa/client/makeRequest').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//See my requests
test('seeMyRequests', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/client/seeMyRequests').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('seeMyRequests invalid rol', async ({client, assert}) => {
    const token = await getTokenAuthAdmin() //No client
    const response = await client.get('api/hastaTuCasa/client/seeMyRequests').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('cancelPurchase', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.put('api/hastaTuCasa/client/cancelPurchase/9/1').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('cancelPurchase invalid purchase', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.put('api/hastaTuCasa/client/cancelPurchase/10/10').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('cancelPurchase purchase is not pending', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.put('api/hastaTuCasa/client/cancelPurchase/2/1').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('cancelPurchase fail', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.put('api/hastaTuCasa/client/cancelPurchase/10').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Add favorite Offer
test('addFavoriteOffer', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/client/addFavoriteOffer/2').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('addFavoriteOffer fail', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/client/addFavoriteOffer/100').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Get favorite offers
test('getFavoriteOffers', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const response = await client.get('api/hastaTuCasa/client/getFavoriteOffers').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getFavoriteOffers fail', async ({client, assert}) => {
    const token = await getTokenAuthAdmin() //No client
    const response = await client.get('api/hastaTuCasa/client/getFavoriteOffers').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Rate offer
test('rateOffer', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        efficiency: 1,
        efficacy: 1,
        customer_service: 1
    }
    const response = await client.post('api/hastaTuCasa/client/rateOffer/2/3').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('rateOffer not allowed', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        efficiency: 1,
        efficacy: 1,
        customer_service: 1
    }
    const response = await client.post('api/hastaTuCasa/client/rateOffer/1').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('rateOffer fail', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = { }
    const response = await client.post('api/hastaTuCasa/client/rateOffer/3').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Comment an offer
test('commentOffer', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        comment: {"comments": ["Test comment"]}
    }
    const response = await client.post('api/hastaTuCasa/client/commentOffer/3').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('commentOffer not allowed', async ({client, assert}) => {
    const token = await getTokenAuthClient()
    const body = {
        comment: {"comments": ["Test comment"]}
    }
    const response = await client.post('api/hastaTuCasa/client/commentOffer/100').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

