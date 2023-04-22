// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import FavoriteOffer from "App/Models/FavoriteOffer"

export default class FavoriteOffersController {

    public async createFavoriteOffer(client, offer){
        try{
            await FavoriteOffer.create({
                client,
                offer
            })

            return {
                state: true,
                message: 'Favorite offer created'
            }

        }catch(error){
            return {
                state: false,
                message: error.message
            }
        }
    }

}
