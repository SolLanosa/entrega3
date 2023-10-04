import SessionService from "../services/session.service.js";

export default class SessionController {
    constructor() {
        this.sessionService = new SessionService()
    }

    async restartPassword(email) {
       await this.sessionService.restartPassword(email)
    }

   async recoverPassword(password, token) {
       await this.sessionService.recoverPassword(password, token)
    }

    async updateLastConnection(email) {
        await this.sessionService.updateLastConnection(email);
    }
}