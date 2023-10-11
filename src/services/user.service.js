import UserDAO from "../daos/mongodb/UserDAO.js"
import { CustomError } from "./errors/CustomError.js"
import EErrors from "./errors/enums.js"
import MailService from "./mail.service.js";

export default class UserService {
    constructor() {
        this.userDAO = new UserDAO()
        this.mailService = new MailService()
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
                name: "Upload documents error",
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

    async getUsers(limit, page) {
        const result = await this.userDAO.getUsers(limit, page);
        return result
    }

    async deleteInactiveUsers() {
        const twoDays = 2 * (24 * 60 * 60 * 1000)
        const filteredUsers = await this.userDAO.getInactiveUsers(twoDays);        
        const result = await this.userDAO.deleteInactiveUsers(filteredUsers);

        await Promise.all(filteredUsers.map(async(user) => {
            await this.mailService.sendMailToInactiveUserAccount(user.email)
            }
        ))
        return result
    }

    async deleteUser(uid) {
        const result = await this.userDAO.deleteUser(uid);
        return result
    }

    async notifyDeletedProduct(uid, productName) {
        const user = await this.userDAO.findById(uid);
        if (!user) {
            CustomError.createError({
                name: "Notify deleted product error",
                cause: "User not found",
                message: "User not found",
                code: EErrors.NOT_FOUND,
            })
        };

        const email = user.email
        const result = await this.mailService.sendMailDeletedProductPremium(email, productName)
        return result
    } 
}