import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rating from 'App/Models/Rating'

export default class RatingsController {

    public async createRating({efficacy, efficiency, customer_service, client, offer}){
        try{
            await Rating.create({
                efficacy,
                efficiency,
                customer_service,
                client,
                offer
            })

            return {
                state: true,
                message: 'Rating created'
            }
        }catch(error){
            return {
                state: false,
                message: error.message
            }
        }
    }

    public async getRatings({response}: HttpContextContract):Promise<void>{
        try{
            const ratings = await Rating.all()

            return response.status(200).json({
                state: true,
                message: 'List of ratings',
                ratings
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

}
