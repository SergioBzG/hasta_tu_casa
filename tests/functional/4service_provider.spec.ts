import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'
import { getTokenAuthServiceProv } from './TestAuthServiceProv'

//Create tests
test('createServiceProv', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        phone: "3196777878",
        name: "Gerardo",
        email: "gerardo@unal.edu.co",
        password: "gerardo",
        address: "Villavicencio",
        bank_account: "67814675453437",
        professional_profile: "Barber",
        document_number: "1001057676"
    }
    const response = await client.post('api/hastaTuCasa/createServiceProvider').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('createServiceProv invalid phone', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        phone: "3196777878",
        name: "Gerardo",
        email: "gerardo@unal.edu.co",
        password: "gerardo",
        address: "Villavicencio",
        bank_account: "67814675453437",
        professional_profile: "Barber",
        document_number: "1001057676"
    }
    const response = await client.post('api/hastaTuCasa/createServiceProvider').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('createServiceProv invalid docuement', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        phone: "3196777877",
        name: "Gerardo",
        email: "gerardo12345@unal.edu.co",
        password: "gerardo",
        address: "Villavicencio",
        bank_account: "67814675453437",
        professional_profile: "Barber",
        document_number: "1001057676"
    }
    const response = await client.post('api/hastaTuCasa/createServiceProvider').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('createServiceProv fail', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = { }
    const response = await client.post('api/hastaTuCasa/createServiceProvider').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Get tests
test('getServiceProviders', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/getServiceProviders').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getServiceProvider by email', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/getServiceProviderByEmail/ame@unal.edu.co').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getServiceProvider by email no found', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/getServiceProviderByEmail/ame1223435@unal.edu.co').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Update service provider
test('updateServiceProvider', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        name: "Sara",
        email: "sara@unal.edu.co",
        password: "sara",
        address: "Manizales",
        bank_account: "8942435093436",
        state: true,
        professional_profile: "Stylist",
        response_time: 30,
        unanswered_requests: 0,
        income: 0
    }
    const response = await client.put('api/hastaTuCasa/updateServiceProvider/7').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('updateServiceProvider invalid id', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        name: "Sara",
        email: "sara@unal.edu.co",
        password: "sara",
        address: "Manizales",
        bank_account: "8942435093436",
        state: true,
        professional_profile: "Stylist",
        response_time: 30,
        unanswered_requests: 0,
        income: 0
    }
    const response = await client.put('api/hastaTuCasa/updateServiceProvider/-2').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('updateServiceProvider User not found', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        name: "Sara",
        email: "sara@unal.edu.co",
        password: "sara",
        address: "Manizales",
        bank_account: "8942435093436",
        state: true,
        professional_profile: "Stylist",
        response_time: 30,
        unanswered_requests: 0,
        income: 0
    }
    const response = await client.put('api/hastaTuCasa/updateServiceProvider/5').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('updateServiceProvider invalid email', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const body = {
        name: "Sara",
        email: "cass@unal.edu.co",
        password: "sara",
        address: "Manizales",
        bank_account: "8942435093436",
        state: true,
        professional_profile: "Stylist",
        response_time: 30,
        unanswered_requests: 0,
        income: 0
    }
    const response = await client.put('api/hastaTuCasa/updateServiceProvider/7').json(body).header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//See my Requests
test('seeMyRequests', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/seeMyRequests').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('seeMyRequests invalid rol', async ({client, assert}) => {
    const token = await getTokenAuthAdmin() //No serviceProvider
    const response = await client.get('api/hastaTuCasa/seeMyRequests').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//See my Offers
test('seeMyOffers', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.get('api/hastaTuCasa/seeMyOffers').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

//Accept purchase
test('acceptPurchase', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.put('api/hastaTuCasa/acceptPurchase/15/4').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('acceptPurchase invalid purchase', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.put('api/hastaTuCasa/acceptPurchase/10/10').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('acceptPurchase purchase is not pending', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.put('api/hastaTuCasa/acceptPurchase/2/3').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('acceptPurchase fail', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.put('api/hastaTuCasa/acceptPurchase/10').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Reject purchase
test('rejectPurchase', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.put('api/hastaTuCasa/rejectPurchase/17/4').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('rejectPurchase invalid purchase', async ({client, assert}) => {
    const token = await getTokenAuthServiceProv()
    const response = await client.put('api/hastaTuCasa/rejectPurchase/10/10').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})
