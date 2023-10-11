import { CustomError } from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import UserService from "../services/user.service.js";
import {UserDTO} from '../controllers/DTO/user.dto.js'

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

   async getUsers(req) {
        let limit = Number(req.query.limit) || 10;
        let page = Number(req.query.page)  || 1;
        const result = await this.userService.getUsers(limit, page)
        result.docs = result.docs.map(u => new UserDTO(u));
        return result
   }

   async deleteInactiveUsers() {
        const result = await this.userService.deleteInactiveUsers()
        return result
   }

   async deleteUser(uid) {
    if(!uid) {
        CustomError.createError({
            name: "Missing id",
            cause: generateMissingId(id),
            message: "Error trying to delete user because id is missing",
            code: EErrors.NOT_FOUND,
        })
    }
    const result = await this.userService.deleteUser(uid)
    return result
   }
}