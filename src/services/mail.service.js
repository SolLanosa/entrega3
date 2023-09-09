import nodemailer from 'nodemailer';
import { CONFIG } from '../config.js';

export default class MailService {
    constructor() {
        this.transport = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user:  CONFIG.MAILER_EMAIL,
                pass: CONFIG.MAILER_PASSWORD

            }
        })
    }

    async sendRecoverPasswordEmail(email, token) {
       await this.transport.sendMail({
            from: 'coder tests <coderecomerce@gmail.com>',
            to: email,
            subject: 'Recuperar contraseña',
            html: `
            <div>
                <p>Esto es un mail para recuperar la contraseña. 
                Para cambiarla haga click en el siguiente <a href="${CONFIG.REDIRECT_BASE_URL}/recoverPassword?token=${token}">link</a></p>
            </div>`
       })
    }
}