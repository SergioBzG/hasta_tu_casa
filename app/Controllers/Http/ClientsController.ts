import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Client from 'App/Models/Client'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import PurchasesController from './PurchasesController'
import RequestsController from './RequestsController'
import Request from 'App/Models/Request'
import RatingsController from './RatingsController'
import FavoriteOffersController from './FavoriteOffersController'
import OffersController from './OffersController'
import Offer from 'App/Models/Offer'

export default class ClientsController {

    public async createClient({request, response}: HttpContextContract):Promise<void>{
        try{
            const userData = request.only(['phone', 'name', 'password', 'email', 'address', 'bank_account', 'role'])
            userData.role = 'Client' //Role of the user
            const clientData = request.only(['phone', 'payment_method'])

            //Create user
            const userControl = new UsersController()
            const responseFromUser = await userControl.createUser(userData)
            if(!responseFromUser.state){
                return response.status(400).json(responseFromUser)
            }

            //Create client
            await Client.create(clientData)

            return response.status(200).json(responseFromUser)

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getClients({response}: HttpContextContract):Promise<void>{
        try{
            const clients = await Database
            .from('users')
            .join('clients', 'users.phone', '=', 'clients.phone')
            .where({state: true})
            .select(['users.id', 'users.name', 'users.phone', 'users.email', 'users.address', 'users.bank_account', 'users.role', 'clients.payment_method', 'clients.level']) 

            return response.status(200).json({
                state: true,
                message: 'List of clients',
                clients
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getClientByEmail({response, params}: HttpContextContract):Promise<void>{
        try{
            const client:Object[] = await Database
            .from('users')
            .join('clients', 'users.phone', '=', 'clients.phone')
            .where({email: params.email})
            .select(['users.id', 'users.name', 'users.phone', 'users.email', 'users.address', 'users.bank_account', 'users.state','users.role', 'clients.payment_method', 'clients.level']) 

            if(!client[0]){
                return response.status(400).json({
                    state:false,
                    message: 'User not found'
                })
            }

            return response.status(200).json({
                state: true,
                client: client[0]
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async updateClientById({request, response, params}: HttpContextContract):Promise<void>{
        try{
            const user:User[] = await User.query().where({id: params.id}).preload('client')
            const client:Client = user[0].client
            if(!client){
                return response.status(400).json({
                    state:false,
                    message: 'User not found'
                })
            }
            const userData = request.only(['id', 'name', 'email', 'password', 'address', 'bank_account', 'state'])
            userData.id = params.id
            const clientData = request.only(['payment_method', 'level'])

            //Update user
            const userControl = new UsersController()
            const responseFromUser = await userControl.updateUserById(userData)

            if(!responseFromUser.state){
                return response.status(400).json(responseFromUser)
            }

            //Update client
            client.merge(clientData)
            await client.save()

            return response.status(200).json({responseFromUser})

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }
    
    public async makeRequest({request, response}: HttpContextContract):Promise<void>{
        try{
            const authorizationHeader:any = request.header('Authorization')
            //Get client phone from token
            const {phone} = await UsersController.getPayload(authorizationHeader)
            const requestData = request.only(['time_limit', 'address', 'comments', 'date', 'client', 'offers'])

            //Create request
            requestData.client = phone
            const requestControl = new RequestsController()
            const responseFromRequest = await requestControl.createRequest(requestData)
            if(!responseFromRequest.state){
                return response.status(400).json(responseFromRequest)
            }

            return response.status(200).json(responseFromRequest)

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async seeMyRequests({request, response}: HttpContextContract):Promise<void>{
        try{
            //Get client phone from token
            const token:any = await request.header('Authorization')
            const { phone } = await UsersController.getPayload(token)
            const client = await Client.query().where({phone}).preload('requests', requestQuery => {
                requestQuery.select('request_code', 'time_limit', 'address', 'comments', 'date').preload('purchases', purchaseQuery => {
                    purchaseQuery.select('state', 'offer').preload('offers', offerQuery => {
                        offerQuery.select('id', 'price', 'description', 'service_provider', 'state')
                    })
                })
            })
            const myRequests = client[0].requests

            return response.status(200).json({
                state: true,
                message: 'List of my requests',
                myRequests
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async cancelPurchase({response, params}: HttpContextContract):Promise<void>{
        try{
            const [request, offer] = params['*']
            const purchaseControl = new PurchasesController()
            const responseFromPurchase = await purchaseControl.changeState(request, offer, 'canceled')

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

    public async addFavoriteOffer({request, response, params}: HttpContextContract):Promise<void>{
        //Get client phone from token
        const authorizationHeader:any = await request.header('Authorization')
        const { phone } = await UsersController.getPayload(authorizationHeader)
        const favoriteOfferControl = new FavoriteOffersController()
        const responseFromFavoriteOffer = await favoriteOfferControl.createFavoriteOffer(phone, params.offer)

        if(!responseFromFavoriteOffer.state){
            return response.status(400).json(responseFromFavoriteOffer)
        }

        return response.status(200).json({
            state: true,
            message: 'Offer added to favorites'
        })

    }

    public async getFavoriteOffers({request, response}: HttpContextContract):Promise<void>{
        try{
            //Get client phone from token
            const authorizationHeader:any = await request.header('Authorization')
            const { phone } = await UsersController.getPayload(authorizationHeader)
            const client:any = await Client.findByOrFail('phone', phone)
            const favoriteOffers = await client.related('offers').query()

            return response.status(200).json({
                state: true,
                message: 'List of favorite offers',
                favoriteOffers
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async rateOffer({request, response, params}: HttpContextContract):Promise<void>{
        try{
            //Fisrt I should verify if that offer (params.offer) has been requested by client, and if the service provider has accepted it. Only in this case the client can rate the offer
            const token:any = await request.header('Authorization')
            const {phone} = await UsersController.getPayload(token)
            const verify:boolean = await this.verifyRateOffer(phone, params.offer)

            if(!verify){
                return response.status(400).json({
                    state: false,
                    message: 'You can not rate this offer'
                })
            }

            const ratingData = request.only(['efficiency', 'efficacy', 'customer_service', 'offer', 'client'])

            ratingData.offer = params.offer
            ratingData.client = phone

            const ratingControl = new RatingsController()
            const responseFromRating = await ratingControl.createRating(ratingData)

            if(!responseFromRating.state){
                return response.status(400).json(responseFromRating)
            }

            //Get money to transfer to service provider

            let dibursedAmount = await Database.
            from('bills')
            .where('purchase', 
                Database.from('purchases')
                .where('offer', params.offer)
                .where('request', 
                    Database.from('requests')
                    .where('client', phone)
                    .select('request_code')
                    )
                .where('state', 'accepted')
                .select('id')
                )
            .select('dibursed_amount')

            //Then money is transferred from client to service provider
            const offer = await Offer.find(params.offer)
            const ServiceProvider = await offer?.related('serviceProvider').query()

            if(ServiceProvider){
                ServiceProvider[0].income = (+ServiceProvider[0].income) + (+dibursedAmount[0].dibursed_amount)
                await ServiceProvider[0].save()
            }

            return response.status(200).json({
                state: true,
                message: 'Offer rated successfully'
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async commentOffer({request, response, params}: HttpContextContract):Promise<void>{
        const authorizationHeader:any = await request.header('Authorization')
        const {phone} = await UsersController.getPayload(authorizationHeader)
        //To comment an offer, the client must have requested it and the service provider must have accepted it
        const verify:boolean = await this.verifyRateOffer(phone, params.offer)

        if(!verify){
            return response.status(400).json({
                state: false,
                message: 'You can not comment this offer'
            })
        }

        const offerControl = new OffersController()
        const responseFromOffer = await offerControl.addComment(request.input('comment'), params.offer) 

        if(!responseFromOffer.state){
            return response.status(400).json(responseFromOffer)
        }

        return response.status(200).json({
            state: true,
            message: 'Offer commented successfully'
        })

    }

    private async verifyRateOffer(phone:string, offer:number):Promise<boolean>{

        const client:Request[] = await Request.query().where({client: phone})
        if (client.length === 0) {
            return false
        }
        const purchaseClient:Request[] = await Request.query().where({client: phone}).preload('purchases', purchaseQuery => {
            purchaseQuery.where({offer: offer}).where({state: 'accepted'})
        })

        return purchaseClient[0].purchases[0] ? true : false
    }

}
