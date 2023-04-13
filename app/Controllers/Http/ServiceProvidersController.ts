import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import ServiceProvider from 'App/Models/ServiceProvider'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import PurchasesController from './PurchasesController'

export default class ServiceProvidersController {

    public async createServiceProvider({request, response}: HttpContextContract):Promise<void>{
        try{
            const userData = request.only(['phone', 'name', 'password', 'email', 'address', 'bank_account', 'role'])
            userData.role = 'ServiceProvider' //Role of the user
            const ServiceProviderData = request.only(['phone', 'professional_profile', 'document_number'])

            if(await this.validateDocument(ServiceProviderData.document_number)){
                return response.status(400).json({
                    state: false,
                    message: 'Already exists a service provider with this document number'
                })
            }
            //Create user
            const userControl = new UsersController()
            const responseFromUser = await userControl.createUser(userData)
            if(!responseFromUser.state){
                return response.status(400).json(responseFromUser)
            }

            //Create ServiceProvider
            await ServiceProvider.create(ServiceProviderData)

            return response.status(200).json(responseFromUser)

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getServiceProviders({response}: HttpContextContract):Promise<void>{
        try{
            const serviceProviders = await Database
            .from('users')
            .join('service_providers', 'users.phone', '=', 'service_providers.phone')
            .where({state: true})
            .select(['users.id', 'users.name', 'users.phone', 'users.email', 'users.address', 'users.bank_account', 'users.role', 'service_providers.professional_profile', 'service_providers.document_number', 'service_providers.response_time', 'service_providers.unanswered_requests', 'service_providers.available', 'service_providers.income']) 

            return response.status(200).json({
                state: true,
                message: 'List of service providers',
                serviceProviders
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getServiceProviderByEmail({response, params}: HttpContextContract):Promise<void>{
        try{
            const serviceProvider:Object[] = await Database
            .from('users')
            .join('service_providers', 'users.phone', '=', 'service_providers.phone')
            .where({email: params.email})
            .select(['users.id', 'users.name', 'users.phone', 'users.email', 'users.address', 'users.bank_account', 'users.state', 'users.role', 'service_providers.professional_profile', 'service_providers.document_number', 'service_providers.response_time', 'service_providers.unanswered_requests', 'service_providers.available', 'service_providers.income']) 

            if(!serviceProvider[0]){
                return response.status(400).json({
                    state:false,
                    message: 'User not found'
                })
            }

            return response.status(200).json({
                state: true,
                serviceProvider: serviceProvider[0]
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async updateServiceProviderById({request, response, params}: HttpContextContract):Promise<void>{
        try{
            const user:User[] = await User.query().where({id: params.id}).preload('serviceProvider')
            const serviceProvider:ServiceProvider = user[0].serviceProvider
            if(!serviceProvider){
                return response.status(400).json({
                    state:false,
                    message: 'User not found'
                })
            }
            const userData = request.only(['id', 'name', 'email', 'password', 'address', 'bank_account', 'state'])
            userData.id = params.id
            const serviceProviderData = request.only(['professional_profile', 'response_time', 'unanswered_requests', 'available', 'income'])

            //Update user
            const userControl = new UsersController()
            const responseFromUser = await userControl.updateUserById(userData)

            if(!responseFromUser.state){
                return response.status(400).json(responseFromUser)
            }

            //Update serviceProvider
            serviceProvider.merge(serviceProviderData)
            await serviceProvider.save()

            return response.status(200).json({responseFromUser})

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async seeMyRequests({request, response}: HttpContextContract):Promise<void>{
        try{
            //Get service provider phone from token
            const token:any = request.header('authorization')
            const { phone } = await UsersController.getPayload(token)
            const myRequests = await ServiceProvider.query().where({phone : phone}).preload('offers', offersQuery => {
                offersQuery.select('id', 'price', 'description', 'service').preload('purchases', purchasesQuery => {
                    purchasesQuery.select('state', 'request').whereIn('state', ['pending', 'accepted', 'rejected']).preload('requests', requestQuery => {
                        requestQuery.select('time_limit', 'address', 'comments', 'date', 'client')
                    })
                })
            })

            // const myRequests:Object[] = await Database
            // .from('service_providers')
            // .join('offers', 'service_providers.phone', '=', 'offers.service_provider')
            // .join('purchases', 'offers.id', '=', 'purchases.offer')
            // .join('requests', 'purchases.request', '=', 'requests.request_code')
            // .where({service_provider: phone})
            // .whereIn('purchases.state', ['pending', 'accepted', 'rejected])
            // .select('offers.id', 'offers.price', 'offers.description', 'offers.service', 'requests.request_code', 'purchases.state', 'requests.time_limit', 'requests.address', 'requests.comments', 'requests.date', 'requests.client')

            const myOffersRequested = myRequests[0].offers

            return response.status(200).json({
                state: true,
                message: 'List of my requests',
                myOffersRequested
            })


        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async seeMyOffers({request, response}: HttpContextContract):Promise<void>{
        try{
            //Get service provider phone from token
            const token:any = request.header('Authorization')
            const { phone } = await UsersController.getPayload(token)
            const serviceProvider = await ServiceProvider.findBy('phone', phone)

            const myOffers = await serviceProvider?.related('offers').query()

            return response.status(200).json({
                state: true,
                message: 'List of my offers',
                myOffers
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async acceptPurchase({request, response, params}: HttpContextContract){
        try{
            //Get service provider phone from token
            const [request_code, offer] = params['*']

            const token:any = request.header('Authorization')
            const { phone } = await UsersController.getPayload(token)
            const serviceProvider:ServiceProvider[] = await ServiceProvider.query().where({phone: phone}).preload('offers', offersQuery => {
                offersQuery.where({id : offer}).preload('services')
            })
            
            const payment_amount:number = serviceProvider[0].offers[0].price
            const commission:number = serviceProvider[0].offers[0].services.commission
            const dibursed_amount:number = payment_amount*(1-commission) 

            const purchaseControl = new PurchasesController()
            const responseFromPurchase = await purchaseControl.changeState(request_code, offer, 'accepted', payment_amount, commission, dibursed_amount)

            if(!responseFromPurchase.state){
                return response.status(400).json(responseFromPurchase)
            }

            return response.status(200).json(responseFromPurchase)
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async rejectPurchase({response, params}: HttpContextContract):Promise<void>{
        try{
            const [request_code, offer] = params['*']
            const purchaseControl = new PurchasesController()
            const responseFromPurchase = await purchaseControl.changeState(request_code, offer, 'rejected')

            if(!responseFromPurchase.state){
                return response.status(400).json(responseFromPurchase)
            }

            return response.status(200).json(responseFromPurchase)
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    private async validateDocument(documentNumber:string):Promise<boolean>{
        const serviceProvider:any = await ServiceProvider.findBy('document_number', documentNumber)
        return serviceProvider ? true : false
    }
    
}
