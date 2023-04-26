import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'


export default class UsersController {
    
    //This function only is called from Clients and ServiceProviders Controller
    public async createUser({phone,  name, email, password, address, bank_account, role}) {
        try{
            if(await this.validateUserByPhone(phone)){
                return {
                    state: false,
                    message: 'Already exists a user with this phone number'
                }
            }

            if(await this.validateUserByEmail(email)){
                return {
                    state: false,
                    message: 'Already exists a user with this email'
                }
            }

            const salt = bcryptjs.genSaltSync(5)
            password = bcryptjs.hashSync(password, salt);

            await User.create({//Create user
                phone,
                name,
                email,
                password,
                address,
                bank_account,
                role
            })

            return {
                state: true,
                message: 'User created successfully'
            }

        }catch(error){
            return {
                state: false,
                message: error.message
            }
        }
    }

    public async loginByPhone({request, response}: HttpContextContract): Promise<void>{
        try{
            const {phone, password} = request.all()
            const user: any = await this.validateUserByPhone(phone)
            if(!user){
                return response.status(400).json({
                    state: false,
                    message: 'Incorrect password or phone'
                })
            }

            const validPassword:boolean = bcryptjs.compareSync(password, user.password)
            if(!validPassword){
                return response.status(400).json({
                    state: false,
                    message: 'Incorrect password or phone'
                })
            } 

            if(!user.state){
                return response.status(400).json({
                    state: false,
                    message: 'This user is inactive'
                })
            }
            
            const payload = {
                name: user.name,
                id: user.id,
                email: user.email,
                phone: user.phone
            }

            const token:string = this.createToken(payload)

            return response.status(200).json({
                state: true,
                message: 'Login successfully',
                name: user.name,
                email: user.email,
                token
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async loginByEmail({request, response}: HttpContextContract): Promise<void>{
        try{
            const {email, password} = request.all()
            const user: any = await this.validateUserByEmail(email)
            if(!user){
                return response.status(400).json({
                    state: false,
                    message: 'Incorrect password or email'
                })
            }

            const validPassword:boolean = bcryptjs.compareSync(password, user.password)
            if(!validPassword){
                return response.status(400).json({
                    state: false,
                    message: 'Incorrect password or email'
                })
            } 
            
            if(!user.state){
                return response.status(400).json({
                    state: false,
                    message: 'This user is inactive'
                })
            }

            const payload = {
                name: user.name,
                id: user.id,
                email: user.email,
                phone: user.phone
            }

            const token:string = this.createToken(payload)

            return response.status(200).json({
                state: true,
                message: 'Login successful',
                name: user.name,
                email: user.email,
                token
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }

    }

    public async getUsers({response}: HttpContextContract):Promise<void> {
        try{
            const users: User[] = await User.query().where({state: true}).from('users').select('id', 'name', 'phone', 'email', 'address', 'bank_account', 'role')
            return response.status(200).json({
                state: true,
                message: 'List of all users',
                users
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getUserByEmail({response, params}: HttpContextContract):Promise<void>{
        try{
            const email:string = params.email.replace('%40', '@')
            const user:User[]  = await User.query().where({email: email}).from('users').select('id', 'name', 'phone', 'email', 'address', 'bank_account', 'state', 'role')
            if(!user[0]){
                return response.status(400).json({
                    state:false,
                    message: 'User not found'
                })
            }
            return response.status(200).json({
                state: true,
                user: user[0]
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async updateUserById({id, name, email, password, address, bank_account, state}) {
        try{
            //The phone atributte is not going to be updated because it is a foriegn key
            const user:User = await User.findOrFail(id)
            const userByEmail:any = await this.validateUserByEmail(email)
    
            //If user going to update the email and verify that there isn't other user with them
            if(userByEmail && userByEmail.id !== user.id){
                return {
                    state: false,
                    message: 'Already exists a user with this email'
                }
            }

            const salt = bcryptjs.genSaltSync(5);
            user.name = name
            user.email = email
            user.password = bcryptjs.hashSync(password, salt)
            user.address = address
            user.bank_account = bank_account
            user.state = state
            await user.save()

            return {
                state: true,
                message: 'User updated successfully'
            }

        }catch(error){
            return {
                state: false,
                message: error.message
            }
        }
    }

    public async deleteUserByid({response, params}: HttpContextContract):Promise<void>{
        try{
            const user:any = await User.findOrFail(params.id)
            user.state = false
            await user.save()
            return response.status(200).json({
                state: true,
                message: 'User deleted successfully'
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    private createToken(payload: object): string{
        const options = {
            expiresIn: '15 mins'
        }
        return jwt.sign(payload, Env.get('JWT_SECRET_KEY'), options);
    }

    public static verifyToken(authorizationHeader:string):boolean {
        const token:string = authorizationHeader.split(' ')[1];
        jwt.verify(token, Env.get('JWT_SECRET_KEY'), (error) => {
            if(error){
                throw new Error('Token expired');
            }
        })
        return true
    }

    public static getPayload(authorizationHeader:string):any {
        const token:string = authorizationHeader.split(' ')[1];
        const payload:any =  jwt.verify(token, Env.get('JWT_SECRET_KEY'), {complete:true}).payload;
        return payload
    }

    private async validateUserByPhone(userPhone: string):Promise<any> {
        const user:any = await User.findBy('phone', userPhone)
        return user;
    }

    private async validateUserByEmail(userEmail: string):Promise<any> {
        const user:any = await User.findBy('email', userEmail)
        return user;
    }
}
