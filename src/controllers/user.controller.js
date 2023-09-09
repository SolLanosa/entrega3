import { CustomError } from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import UserService from "../services/user.service.js";

export default class UserController {
    constructor() {
        this.userService = new UserService()
    }

   async changeRole(uid, role) {
    if(!uid || !role || !['user', 'premium'].includes(role) ) {
        CustomError.createError({
            name: "Change role error",
            cause: "Missing uid or invalid role",
            message: "Error trying changing role",
            code: EErrors.INVALID_TYPES_ERROR,
        })
    }
      await this.userService.changeRole(uid,role)
   }
}