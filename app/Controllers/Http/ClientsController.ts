import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from './UsersController'
import Client from 'App/Models/Client'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class ClientsController {

    public async createClient({request, response}: HttpContextContract){
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

    public async getClients({response}: HttpContextContract){
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

    public async getClientByEmail({response, params}: HttpContextContract){
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
                message: 'List of clients',
                type: typeof client[0],
                client: client[0]
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async updateClientById({request, response, params}: HttpContextContract){
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
    
    public async makeRequest({response}: HttpContextContract):Promise<void>{
        try{

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getFavoriteOffers({response}: HttpContextContract):Promise<void>{
        try{

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async rateOffer({response}: HttpContextContract):Promise<void>{
        try{

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }


}
