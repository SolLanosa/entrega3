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

   async uploadDocuments(uid, files) {
    if(!files){
        CustomError.createError({
            name: "Documents upload errror",
            cause: "Image couldnt be saved",
            message: "Error trying uploading documents",
            code: EErrors.GENERIC_ERROR,
        })
       }
    await this.userService.uploadDocuments(uid, files)
   }
}