import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import ServiceProvider from 'App/Models/ServiceProvider'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

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
                offersQuery.select('id', 'price', 'description', 'service').preload('requests', requestsQuery => {
                    requestsQuery.select('request_code', 'time_limit', 'address', 'comments', 'date', 'state', 'client')
                })
            })

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

    private async validateDocument(documentNumber:string):Promise<boolean>{
        const serviceProvider:any = await ServiceProvider.findBy('document_number', documentNumber)
        return serviceProvider ? true : false
    }
    
}
