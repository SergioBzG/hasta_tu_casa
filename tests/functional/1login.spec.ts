import { test } from '@japa/runner'

test('loginUser by email', async ({client, assert}) => {
    const body = {
        email: "cass@unal.edu.co",
        password: "cass"
    }
    const response = await client.post('api/hastaTuCasa/loginByEmail').json(body)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('loginUser invalid email', async ({client, assert}) => {
    const body = {
        email: "cass034@unal.edu.co",
        password: "cass"
    }
    const response = await client.post('api/hastaTuCasa/loginByEmail').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('loginUser invalid password', async ({client, assert}) => {
    const body = {
        email: "cass@unal.edu.co",
        password: "134556"
    }
    const response = await client.post('api/hastaTuCasa/loginByEmail').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('loginUser inactive user', async ({client, assert}) => {
    const body = {
        email: "carlos@unal.edu.co",
        password: "carlos"
    }
    const response = await client.post('api/hastaTuCasa/loginByEmail').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('loginUser fail', async ({client, assert}) => {
    const body = { }
    const response = await client.post('api/hastaTuCasa/loginByPhone').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//By Phone
test('loginUser by phone', async ({client, assert}) => {
    const body = {
        phone: "3149896767",
        password: "hele"
    }
    const response = await client.post('api/hastaTuCasa/loginByPhone').json(body)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('loginUser invalid phone', async ({client, assert}) => {
    const body = {
        phone: "00000000",
        password: "hele"
    }
    const response = await client.post('api/hastaTuCasa/loginByPhone').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('loginUser invalid password', async ({client, assert}) => {
    const body = {
        phone: "3149896767",
        password: "1234"
    }
    const response = await client.post('api/hastaTuCasa/loginByPhone').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('loginUser inactive user', async ({client, assert}) => {
    const body = {
        phone: "3145678345",
        password: "carlos"
    }
    const response = await client.post('api/hastaTuCasa/loginByPhone').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('loginUser by phone fail', async ({client, assert}) => {
    const body = { }
    const response = await client.post('api/hastaTuCasa/loginByPhone').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})