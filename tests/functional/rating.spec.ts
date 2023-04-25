import { test } from '@japa/runner'
import { getTokenAuthAdmin } from './TestAuthAdmin'

//Get tests
test('getRatings', async ({client, assert}) => {
    const token = await getTokenAuthAdmin()
    const response = await client.get('api/hastaTuCasa/getRatings').header('Authorization', `Bearer ${token}`)
    response.assertStatus(200)
    assert.isObject(response.body())
})
