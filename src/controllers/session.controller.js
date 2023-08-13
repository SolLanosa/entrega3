import SessionService from "../services/session.service.js";

export default class SessionController {
    constructor() {
        this.sessionService = new SessionService()
    }

    resetPassword(email, password) {
        this.sessionService.restartPassword(email, password)
    }
}