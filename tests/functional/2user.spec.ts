import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'
import { getTokenAuthClient } from './TestAuthClient'

test('getUsers', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getUsers').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getUser by email', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getUserByEmail/cass@unal.edu.co').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('getUser by email fail', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getUserByEmail/serach@unal').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

test('deleteUser', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.delete('api/hastaTuCasa/deleteUser/3').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('deleteUser fail', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.delete('api/hastaTuCasa/deleteUser/5712').header('Authorization', `Bearer ${token}`)
    response.assertStatus(400)
    assert.isObject(response.body())
})

//Tests of authentification
test('deleteUser no permission', async ({client, assert}) => {
    const token = await getTokenAuthClient() //No Admin
    const response = await client.delete('api/hastaTuCasa/deleteUser/5712').header('Authorization', `Bearer ${token}`)
    response.assertStatus(401)
    assert.isObject(response.body())
})

test('deleteUser no token', async ({client, assert}) => {
    const response = await client.delete('api/hastaTuCasa/deleteUser/5712')
    response.assertStatus(401)
    assert.isObject(response.body())
})