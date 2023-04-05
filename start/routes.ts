/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => { //Routes for User
  Route.post('/loginByPhone', 'UsersController.loginByPhone')
  Route.post('/loginByEmail', 'UsersController.loginByEmail')
  Route.get('/getUsers', 'UsersController.getUsers')
  Route.get('/getUserByEmail/:email', 'UsersController.getUserByEmail')
  Route.delete('/deleteUser/:id', 'UsersController.deleteUserByid')
}).prefix('api/hastaTuCasa')

Route.group(() => {//Routes for Client
  Route.post('/createClient', 'ClientsController.createClient')
  Route.get('/getClients', 'ClientsController.getClients')
  Route.get('/getClientByEmail/:email', 'ClientsController.getClientByEmail')
  Route.put('/updateClient/:id', 'ClientsController.updateClientById')
}).prefix('api/hastaTuCasa')
