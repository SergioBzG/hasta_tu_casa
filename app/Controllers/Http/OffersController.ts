import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Offer from 'App/Models/Offer'
import Service from 'App/Models/Service'
import ServiceProvider from 'App/Models/ServiceProvider'

export default class OffersController {

    public async createOffer({request, response}: HttpContextContract):Promise<void>{
        try{
            const offerData = request.only(['price', 'description', 'service', 'service_provider'])
            if(!await this.validateOffer(offerData.service, offerData.service_provider)){
                return response.status(400).json({
                    state: false,
                    message: 'Service or service provider not found'
                })
            }

            if(await this.validateDuplicateOffer(offerData.service, offerData.service_provider, offerData.description)){
                return response.status(400).json({
                    state: false,
                    message: 'This offer already exists in your profile'
                })
            }

            await Offer.create(offerData)
            return response.status(200).json({
                state: true,
                message: 'Offer created successfully'
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getOffers({response}: HttpContextContract):Promise<void>{
        try{
            const offers = await Offer.query().where({state: true}).from('offers')

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

    public async getOfferById({response, params}: HttpContextContract):Promise<void>{
        try{
            const offer:any = await Offer.find(params.id)

            if(!offer){
                return response.status(400).json({
                    state: false,
                    message: 'Offer not found'
                })
            }

            return response.status(200).json({
                state: true,
                offer
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async updateOfferById({request, response, params}: HttpContextContract):Promise<void>{
        try{
            const offer:any = await Offer.find(params.id)
            if(!offer){
                return response.status(400).json({
                    state: false,
                    message: 'Offer not found'
                })
            }

            const offerData = request.only(['price', 'description'])
            offer.merge(offerData)
            await offer.save()

            return response.status(200).json({
                state: true,
                message: 'Offer updated successfully'
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async deleteOfferById({response, params}: HttpContextContract):Promise<void>{
        try{
            const offer:any = await Offer.find(params.id)
            if(!offer){
                return response.status(400).json({
                    state: false,
                    message: 'Offer not found'
                })
            }

            offer.state = false
            await offer.save()
            return response.status(200).json({
                state: true,
                message: 'Offer deleted successfully'
            })
            
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async addComment(comment, offerId:number){
        try{
            const offer:any = await Offer.findOrFail(offerId)
            if(!offer.comments){
                offer.comments = comment
                await offer.save()
            }else{
                offer.comments.comments.push(comment.comments[0])
                await offer.save()
            }
            return {
                state: true,
                message: 'Comment added successfully'
            }
        }catch(error){
            return {
                state: false,
                message: error.message
            }                                                               
        }
    }

    private async validateOffer(service:string, serviceProvider:string): Promise<boolean>{
        //First verify if the service provider exists
        if(await ServiceProvider.findBy('phone', serviceProvider)){
            //Then verify if the service exists
            if(await Service.findBy('name', service)){
                return true
            }
            return false
        }
        return false
    }

    private async validateDuplicateOffer(service:string, serviceProvider:string, description:string): Promise<boolean>{
        const offer:Offer[] = await Offer.query().where({service : service}).where({service_provider : serviceProvider}).from('offers')
        if(offer.length > 0 && offer[0].description === description){
           return true //It means that the offer already exists
        }
        return false
    }

}
