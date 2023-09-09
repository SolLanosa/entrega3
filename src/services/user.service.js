import UserDAO from "../daos/mongodb/UserDAO.js"

export default class UserService {
    constructor() {
        this.userDAO = new UserDAO()
    }

    async changeRole(uid,role) {
       await this.userDAO.changeRole(uid,role)
    }
}