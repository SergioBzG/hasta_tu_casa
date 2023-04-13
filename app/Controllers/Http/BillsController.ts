import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bill from 'App/Models/Bill'

export default class BillsController {

   public async createBill({payment_amount, commission, dibursed_amount, purchase}) {
        try{
            await Bill.create({
                payment_amount,
                commission,
                dibursed_amount,
                purchase
            })

            return {
                state: true,
                message: 'Bill created successfully'
            }
        }catch(error){
           return {
               state: false,
               message: error.message
           }
        }
   }

   public async getBills({response}: HttpContextContract):Promise<void>{
        try{
            const bills:Bill[] = await Bill.query().from('bills')

            return response.status(200).json({
                state: true,
                message: 'List of bills',
                bills
            })

        }catch(error){
            return response.status(400).json({
                state: true,
                message: error.message
            })
        }
   }

}
