import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UsersController from "App/Controllers/Http/UsersController";
import User from "App/Models/User";

export default class ValidAdmin {

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    try {
      const autorizationHeader:any = ctx.request.header("Authorization");
      const {id} = await UsersController.getPayload(autorizationHeader);
      const user = await User.find(id);

      if(!user){
        return ctx.response.status(401).json({
          state: false,
          message: 'No valid token'
        })
      }

      if(user.role !== 'Admin'){
        return ctx.response.status(401).json({
          state: false,
          message: 'You do not have permission to access this resource'
        })
      }

      await next()

    } catch (error) {
      return ctx.response.status(400).json({
        state: true,
        message: error.message,
      });
    }
  }

}
