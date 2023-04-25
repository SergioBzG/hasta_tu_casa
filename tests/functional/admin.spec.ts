import { test } from '@japa/runner'

//Create tests
test('createAdmin', async ({client, assert}) => {
    const body = {
        phone: "454545",
        name: "Noelia",
        email: "noe@unal.edu.co",
        password: "cass",
        address: "CL 68 # 51bB-31"
    }
    const response = await client.post('api/hastaTuCasa/createAdmin').json(body)
    response.assertStatus(200)
    assert.isObject(response.body())
})

test('createAdmin invalid phone', async ({client, assert}) => {
    const body = {
        phone: "454545",
        name: "Noelia",
        email: "noe@unal.edu.co",
        password: "cass",
        address: "CL 68 # 51bB-31"
    }
    const response = await client.post('api/hastaTuCasa/createAdmin').json(body)
    response.assertStatus(400)
    assert.isObject(response.body())
})