import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from 'App/Models/Service'

export default class ServicesController {

    public async createService({request, response}: HttpContextContract):Promise<void>{
        try{
            const serviceData = request.only(['name', 'category', 'commission'])
            if(await this.validateServiceByName(serviceData.name)){
                return response.status(400).json({
                    state: false,
                    message: 'Already exists a service with this name'
                })
            }

            await Service.create(serviceData)

            return response.status(200).json({
                state: true,
                message: 'Service created successfully'
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getServices({response}: HttpContextContract):Promise<void>{
        try{
            const services:Service[] = await Service.query().where({state: true}).from('services')

            return response.status(200).json({
                state: true,
                message: 'List of services',
                services
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async getServiceByName({response, params}: HttpContextContract):Promise<void>{
        try{
            const service:any = await Service.findBy('name', params.name)
            if(!service){
                return response.status(400).json({
                    state: false,
                    message: 'Service not found'
                })
            }

            return response.status(200).json({
                state: true,
                service
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async updateServiceById({request, response, params}: HttpContextContract):Promise<void>{
        try{
            const service:any = await Service.find(params.id)
            if(!service){
                return response.status(400).json({
                    state: false,
                    message: 'Service not found'
                })
            }

            const serviceData = request.only(['name', 'category', 'commission'])
            const serviceByName = await Service.findBy('name', serviceData.name)
            if(serviceByName && serviceByName.id !== service.id){
                return response.status(400).json({
                    state: false,
                    message: 'Already exists a service with this name'
                })
            }

            service.merge(serviceData)
            await service.save()

            return response.status(200).json({
                state: true,
                message: 'Service updated successfully'
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    public async deleteServiceById({response, params}: HttpContextContract):Promise<void>{
        try{
            const service:any = await Service.findOrFail(params.id)
            service.state = false
            console.log(service)
            await service.save()
            return response.status(200).json({
                state: true,
                message: 'Service deleted successfully'
            })

        }catch(error){
            return response.status(400).json({
                state: false,
                message: error.message
            })
        }
    }

    private async validateServiceByName(name: string): Promise<boolean>{
        const service:any = await Service.findBy('name', name)
        return service ? true : false
    }

}
