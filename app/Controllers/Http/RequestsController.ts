import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Request from 'App/Models/Request'
import PurchasesController from './PurchasesController'

export default class RequestsController {

    public async createRequest({time_limit, address, comments, date, state, client, offers}){
        try{
            const request:Request = await Request.create({//Create request
                time_limit,
                address,
                comments,
                date,
                state,
                client
            })

            const purchaseControl = new PurchasesController()
            const responseFromPurchase = await purchaseControl.createPurchase(offers, request.request_code)//Create purchase

            if(!responseFromPurchase.state){
                await request.delete()
                return responseFromPurchase
            }

            return {
                state: true,
                message: 'Request created successfully'
            }

        }catch(error){
            return {
                state: false,
                message: error.message
            }
        }
    }

    public async getRequests({response}: HttpContextContract):Promise<void>{
        try{
            const requests:Request[] = await Request.all()

            return response.status(200).json({
                state: true,
                message: 'List of requests',
                requests
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getRequestByCode({response, params}: HttpContextContract):Promise<void>{
        try{
            const request = await Request.find(params.code)
            if(!request){
                return response.status(400).json({
                    state: false,
                    message: 'Request not found'
                })
            }
            return response.status(200).json({
                state: true,
                request
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getRequestByClient({response, params}: HttpContextContract):Promise<void>{
        try{
            const requests:Request[] = await Request.query().where({client : params.client}).from('requests')

            return response.status(200).json({
                state: true,
                message: 'List of requests',
                requests
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getRequestByState({response, params}: HttpContextContract):Promise<void>{
        try{
            const requests:Request[] = await Request.query().where({state : params.state}).from('requests')

            return response.status(200).json({
                state: true,
                message: `List of requests with state ${params.state}`,
                requests
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getOffersByRequest({response, params}: HttpContextContract):Promise<void>{
        try{
            const request = await Request.find(params.code)
            // const request = await Request.find(params.code).preload('offers')
            if(!request){
                return response.status(400).json({
                    state: false,
                    message: 'Request not found'
                })
            }
            const offers = await request.related('offers').query()
            // const offers = request.offers
            return response.status(200).json({
                state: true,
                message: 'List of offers',
                offers
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }
}
