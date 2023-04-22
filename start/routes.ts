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
  Route.get('/getUsers', 'UsersController.getUsers').middleware(['auth', 'admin'])
  Route.get('/getUserByEmail/:email', 'UsersController.getUserByEmail').middleware(['auth', 'admin'])
  Route.delete('/deleteUser/:id', 'UsersController.deleteUserByid').middleware(['auth', 'admin'])
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
  Route.get('/seeMyRequests', 'ClientsController.seeMyRequests')
  Route.put('/cancelPurchase/*', 'ClientsController.cancelPurchase')
  Route.get('/addFavoriteOffer/:offer', 'ClientsController.addFavoriteOffer')
  Route.get('/getFavoriteOffers', 'ClientsController.getFavoriteOffers')
  Route.post('/rateOffer/:offer', 'ClientsController.rateOffer')
  Route.post('/commentOffer/:offer', 'ClientsController.commentOffer')
}).prefix('api/hastaTuCasa/client').middleware(['auth', 'client'])

Route.group(() => {//Routes for ServiceProvider
  Route.post('/createServiceProvider', 'ServiceProvidersController.createServiceProvider')
  Route.get('/getServiceProviders', 'ServiceProvidersController.getServiceProviders')
  Route.get('/getServiceProviderByEmail/:email', 'ServiceProvidersController.getServiceProviderByEmail')
  Route.put('/updateServiceProvider/:id', 'ServiceProvidersController.updateServiceProviderById')
  Route.get('/seeMyRequests', 'ServiceProvidersController.seeMyRequests')
  Route.get('/seeMyOffers', 'ServiceProvidersController.seeMyOffers')
  Route.put('/acceptPurchase/*', 'ServiceProvidersController.acceptPurchase')
  Route.put('/rejectPurchase/*', 'ServiceProvidersController.rejectPurchase')
}).prefix('api/hastaTuCasa').middleware(['auth', 'serviceProvider'])

Route.group(() => {//Routes for Service
  Route.post('/createService', 'ServicesController.createService').middleware('admin')
  Route.get('/getServices', 'ServicesController.getServices')
  Route.get('/getServiceByName/:name', 'ServicesController.getServiceByName')
  Route.put('/updateService/:id', 'ServicesController.updateServiceById').middleware('admin')
  Route.delete('/deleteService/:id', 'ServicesController.deleteServiceById').middleware('admin')
}).prefix('api/hastaTuCasa').middleware('auth')

Route.group(() => {//Routes for Offer
  Route.post('/createOffer', 'OffersController.createOffer').middleware('serviceProvider')
  Route.get('/getOffers', 'OffersController.getOffers')
  Route.get('/getOfferById/:id', 'OffersController.getOfferById')
  Route.put('/updateOffer/:id', 'OffersController.updateOfferById').middleware('serviceProvider')
  Route.delete('/deleteOffer/:id', 'OffersController.deleteOfferById').middleware('serviceProvider')
}).prefix('api/hastaTuCasa').middleware('auth')

Route.group(() => {//Routes for Requests
  Route.get('/getRequests', 'RequestsController.getRequests')
  Route.get('/getRequestByCode/:code', 'RequestsController.getRequestByCode')
  Route.get('/getRequestByClient/:client', 'RequestsController.getRequestByClient')
  Route.get('/getOffersByRequest/:code', 'RequestsController.getOffersByRequest')
}).prefix('api/hastaTuCasa').middleware(['auth', 'admin'])

Route.group(() => {//Routes for Purchases
  Route.get('/getPurchases', 'PurchasesController.getPurchases')
  Route.get('/getPurchaseById/:id', 'PurchasesController.getPurchaseById')
  Route.get('/getPurchaseByState/:state', 'PurchasesController.getPurchaseByState')
  Route.get('/getBillPurchase/:id', 'PurchasesController.getBillPurchase')
}).prefix('api/hastaTuCasa').middleware(['auth', 'admin'])

Route.group(() => {//Routes for Bills
  Route.get('/getBills', 'BillsController.getBills')
  Route.get('/getBillByPurchase/:purchase', 'BillsController.getBillByPurchase')
}).prefix('api/hastaTuCasa').middleware(['auth', 'admin'])

Route.group(() => {//Routes for Ratings
  Route.get('/getRatings', 'RatingsController.getRatings')
}).prefix('api/hastaTuCasa').middleware(['auth', 'admin'])