import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UsersController from "App/Controllers/Http/UsersController";

export default class AuthJwt {

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const autorizationHeader: any = ctx.request.header("Authorization");
      if (!autorizationHeader) {
        return ctx.response.status(401).json({
          state: false,
          message: "Missing authorization token",
        });
      }

      UsersController.verifyToken(autorizationHeader);
      await next();
    } catch (error) {
      return ctx.response.status(400).json({
        state: true,
        message: error.message,
      });
    }
  }
  
}
