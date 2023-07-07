import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Admin from 'App/Models/Admin'
import UsersController from './UsersController'

export default class AdminsController {

    public async createAdmin({request, response}: HttpContextContract):Promise<void>{
        try{
            // const userData = request.only(['phone', 'name', 'password', 'email', 'address', 'bank_account', 'role'])
            const userData = {
                phone: "3104975520",
                name: "Cassandra",
                password: "cass",
                email: "cass@unal.edu.co",
                address: "KR 51C",
                bank_account: null,
                role: ""
            }
            userData.role = "Admin" //Role of the user
            const adminData = {
                phone: userData.phone
            }

            //Create user
            const userControl = new UsersController()
            const responseFromUser = await userControl.createUser(userData)
            if(!responseFromUser.state){
                return response.status(400).json(responseFromUser)
            }

            //Create Admin
            await Admin.create(adminData)

            return response.status(200).json(responseFromUser)

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

}
