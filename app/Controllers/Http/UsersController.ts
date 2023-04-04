import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'


export default class UsersController {

    public async createUser({request, response}: HttpContextContract): Promise<void>{
        try{
            const userData = request.only(['phone', 'name', 'password', 'email', 'address', 'state', 'bank_account', 'role']) 

            if(await this.validateUserByPhone(userData.phone)){
                return response.status(400).json({
                    state: false,
                    message: 'Already exists a user with this phone number'
                })
            }

            if(await this.validateUserByEmail(userData.email)){
                return response.status(400).json({
                    state: false,
                    message: 'Already exists a user with this email'
                })
            }

            const salt = bcryptjs.genSaltSync(5)
            userData.password = bcryptjs.hashSync(userData.password, salt);
            await User.create(userData)
            return response.status(200).json({
                state: true,
                messge: 'User created successfully'
            })
        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
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
            
            const payload = {
                name: user.name,
                id: user.id,
                email: user.email
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
            
            const payload = {
                name: user.name,
                id: user.id,
                email: user.email
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

    public async getUsers({response}: HttpContextContract):Promise<void> {
        try{
            const users: User[] = await User.query().where({state: true}).from('users').select('id', 'name', 'phone', 'email', 'address', 'state', 'role')
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
            const user:User[]  = await User.query().where({email: params.email}).from('user').select('id', 'name', 'phone', 'email', 'address', 'state', 'role')
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

    public async updateUserById({request, response, params}: HttpContextContract):Promise<void>{
        try{
            const user:User = await User.findOrFail(params.id)
            const [phone, email] = [request.input('phone'), request.input('email')]
            if(await this.validateUserByPhone(phone)){
                return response.status(400).json({
                    state: false,
                    message: 'Already exists a user with this phone number'
                })
            }

            if(await this.validateUserByEmail(email)){
                return response.status(400).json({
                    state: false,
                    message: 'Already exists a user with this email'
                })
            }
            const salt = bcryptjs.genSaltSync(5);
            user.phone = phone
            user.name = request.input('name')
            user.password = bcryptjs.hashSync(request.input('password'), salt)
            user.email = request.input('email')
            user.address = request.input('address')
            user.state = request.input('state')
            user.bank_account = request.input('bank_account')
            await user.save()
            return response.status(200).json({
                state: true,
                message: 'User updated successfully'
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async deleteUserByid({response, params}: HttpContextContract):Promise<void>{
        try{
            const user:any = User.findOrFail(params.id)
            user.state = false
            await user.save()
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
                throw new Error('Token expirado');
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
