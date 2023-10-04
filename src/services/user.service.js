import UserDAO from "../daos/mongodb/UserDAO.js"
import { CustomError } from "./errors/CustomError.js"
import EErrors from "./errors/enums.js"

export default class UserService {
    constructor() {
        this.userDAO = new UserDAO()
    }

    async changeRole(uid,role) {
        const user = await this.userDAO.findById(uid)
        if (!user) {
            CustomError.createError({
                name: "Change role error",
                cause: "User not found",
                message: "User not found",
                code: EErrors.NOT_FOUND,
            })
        }
        if(role === "premium") {
            const documents = user.documents.filter(doc => [
                "identificacion", 
                "domicilio", 
                "estado de cuenta"
            ].includes(doc.name.split('.')[0]))

            if(documents.length < 3) {
                CustomError.createError({
                    name: "Change role error",
                    cause: "Missing documents",
                    message: "Cannot change to premium, missing documents",
                    code: EErrors.GENERIC_ERROR,
                })
            }

        }
       await this.userDAO.changeRole(uid,role)
    }

    async uploadDocuments(uid, files) {
        const user = await this.userDAO.findById(uid);
        if (!user) {
            CustomError.createError({
                name: "Change role error",
                cause: "User not found",
                message: "User not found",
                code: EErrors.NOT_FOUND,
            })
        };
        
        user.documents = Object.values(files).flat().map(file => ({
         name: file.filename,
         reference: file.path
        }))

        await user.save()
    }
}