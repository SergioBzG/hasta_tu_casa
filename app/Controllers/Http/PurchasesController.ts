import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Offer from 'App/Models/Offer'
import Purchase from 'App/Models/Purchase'
import BillsController from './BillsController'

export default class PurchasesController {

    public async createPurchase(offers:Array<number>, request:number){
        try{
            //Verify that all offers exist
            for(const offer of offers){
                if(!await this.validateOffer(offer)){
                    return {
                        state: false,
                        message: 'Offer not found'
                    }
                }
                await Purchase.create({
                    offer,
                    request,
                })
            }

            return {
                state: true,
                message: 'Purchase created'
            }

        }catch(error){
            return {
                state: false,
                message: error.message
            }
        }
    }

    public async getPurchases({response}: HttpContextContract):Promise<void>{
        try{
            const purchases = await Purchase.query().from('purchases')

            return response.status(200).json({
                state: true,
                message: 'List of purchases',
                purchases
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getPurchaseById({response, params}: HttpContextContract):Promise<void>{
        try{
            const purchase = await Purchase.find(params.id)
            if(!purchase){
                return response.status(400).json({
                    state: false,
                    message: 'Purchase not found'
                })
            }
            return response.status(200).json({
                state: true,
                purchase
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getPurchaseByState({response, params}: HttpContextContract):Promise<void>{
        try{
            const purchases:Purchase[] = await Purchase.query().where({state : params.state}).from('purchases')

            return response.status(200).json({
                state: true,
                message: `List of purchases with state ${params.state}`,
                purchases
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getBillPurchase({response, params}: HttpContextContract):Promise<void>{
        try{
            const purchase:Purchase[] = await Purchase.query().where({id: params.id}).where({state: 'accepted'}).from('purchases').select('id', 'offer', 'request').preload('bill')

            return response.status(200).json({
                state: true,
                purchase
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async changeState(request: number, offer: number, state: string, payment_amount = 0, commission = 0, dibursed_amount = 0) {
        try{
            const purchase:Purchase[] = await Purchase.query().where({request: request}).where({offer: offer}).from('purchases')

            if(!purchase[0]){
                return {
                    state: false,
                    message: 'Purchase not found'
                }
            }
   
            if(purchase[0].state !== 'pending'){
                return {
                    state: false,
                    message: 'Purchase is not pending'
                }
            }
            if(state === 'accepted'){
                const billControl = new BillsController()
                const billData = {payment_amount, commission, dibursed_amount, purchase: purchase[0].id}
                const responseFromBill = await billControl.createBill(billData)
                if(!responseFromBill.state){
                    return responseFromBill
                }
            }
            purchase[0].state = state
            await purchase[0].save()
            return {
                state: true,
                message: `Purchase ${state}`
            }

        }catch(error){
            return {
                state: false,
                message: error.message
            }
        }
    }

    private async validateOffer(offerId: number):Promise<any>{
        const offer:any = await Offer.find(offerId)
        return offer ? true : false
    }

}
