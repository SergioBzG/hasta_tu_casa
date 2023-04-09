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

Route.group(() => {//Routes for Admin
  Route.post('/createAdmin', 'AdminsController.createAdmin')
}).prefix('api/hastaTuCasa')

Route.group(() => {//Routes for Client
  Route.post('/createClient', 'ClientsController.createClient')
  Route.get('/getClients', 'ClientsController.getClients')
  Route.get('/getClientByEmail/:email', 'ClientsController.getClientByEmail')
  Route.put('/updateClient/:id', 'ClientsController.updateClientById')
  Route.post('/makeRequest', 'ClientsController.makeRequest')
  Route.get('/getFavoriteOffers', 'ClientsController.getFavoriteOffers')
  Route.post('/rateOffer', 'ClientsController.rateOffer')
}).prefix('api/hastaTuCasa')

Route.group(() => {//Routes for ServiceProvider
  Route.post('/createServiceProvider', 'ServiceProvidersController.createServiceProvider')
  Route.get('/getServiceProviders', 'ServiceProvidersController.getServiceProviders')
  Route.get('/getServiceProviderByEmail/:email', 'ServiceProvidersController.getServiceProviderByEmail')
  Route.put('/updateServiceProvider/:id', 'ServiceProvidersController.updateServiceProviderById')
  Route.get('/seeMyRequests', 'ServiceProvidersController.seeMyRequests')
}).prefix('api/hastaTuCasa')

Route.group(() => {//Routes for Service
  Route.post('/createService', 'ServicesController.createService')
  Route.get('/getServices', 'ServicesController.getServices')
  Route.get('/getServiceByName/:name', 'ServicesController.getServiceByName')
  Route.put('/updateService/:id', 'ServicesController.updateServiceById')
  Route.delete('/deleteService/:id', 'ServicesController.deleteServiceById')
}).prefix('api/hastaTuCasa')

Route.group(() => {//Routes for Offer
  Route.post('/createOffer', 'OffersController.createOffer')
  Route.get('/getOffers', 'OffersController.getOffers')
  Route.get('/getOfferById/:id', 'OffersController.getOfferById')
  Route.put('/updateOffer/:id', 'OffersController.updateOfferById')
  Route.delete('/deleteOffer/:id', 'OffersController.deleteOfferById')
}).prefix('api/hastaTuCasa')

Route.group(() => {//Routes for Requests
  Route.get('/getRequests', 'RequestsController.getRequests')
  Route.get('/getRequestByCode/:code', 'RequestsController.getRequestByCode')
  Route.get('/getRequestByClient/:client', 'RequestsController.getRequestByClient')
  Route.get('/getRequestByState/:state', 'RequestsController.getRequestByState')
  Route.get('/getOffersByRequest/:code', 'RequestsController.getOffersByRequest')
}).prefix('api/hastaTuCasa')