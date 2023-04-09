import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Offer from 'App/Models/Offer'
import Purchase from 'App/Models/Purchase'

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
                    request
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
            const purchases = await Purchase.query().where({state: true}).from('purchases')

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
                    state: true,
                    message: 'Purchase found',
                    purchase
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

    public async deletePurchase(purchaseId:number){
        try{
            const purchase:any = await Purchase.find(purchaseId)
            if(!purchase){
                return {
                    state: false,
                    message: 'Purchase not found'
                }
            }
            purchase.state = false
            await purchase.save()
            return {
                state: true,
                message: 'Purchase deleted successfully'
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
