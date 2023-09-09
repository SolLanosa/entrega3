import CartService from "./cart.service.js";
import { createHash, isValidPassword } from '../utils.js';
import UserDao from '../daos/mongodb/UserDAO.js'
import { CONFIG } from "../config.js";
import MailService from "./mail.service.js";
import {randomBytes} from 'crypto';
import { CustomError } from "./errors/CustomError.js"; 
import EErrors from "./errors/enums.js";

export const USER_ADMIN = {
    name: 'Admin', 
    email: CONFIG.ADMIN_EMAIL,
    role: 'admin',
    _id:'admin'
}

export default class SessionService {
    constructor() {
        this.userDao = new UserDao()
        this.cartService = new CartService()
        this.mailService = new MailService()
    }

    async register(newUser) {
        const user = await this.userDao.findByEmail(newUser.email)
        if(user){
            return null
        }

        const newCart = await this.cartService.createCart();
        newUser.password = createHash(newUser.password);
        newUser.cart = newCart._id
        const savedUser = await this.userDao.createUser(newUser);
        return savedUser
    }

    async login(username, password) {
        if (username === CONFIG.ADMIN_EMAIL && password===CONFIG.ADMIN_PASSWORD) {
            return USER_ADMIN
        }

        const user = await this.userDao.findByEmail(username);
        if(!user) {
            return null
        }
        if (!isValidPassword(user.password, password)) return null
        return user 
    }

    async loginWithGithub(profile) {
        let user = await this.userDao.findByFirstName({first_name: profile._json.name})
        if (!user){
            let newUser = {
                first_name: profile._json.name,
                last_name: 'lastName',
                email: profile.profileUrl, //github no comparte el mail
                age: 25,
                password: '',
                role: 'user'
            }
            const savedUser = await this.userDao.createUser(newUser);
            return savedUser;
        } 
        return null
    }

    async restartPassword(email) {
        const user = await this.userDao.findByEmail(email);
        if(!user) return null
        const token = randomBytes(20).toString('hex');
        const expirationDate = new Date(Date.now() + 3600 * 1000);
        await this.userDao.setRecoverToken(email, token, expirationDate)
        await this.mailService.sendRecoverPasswordEmail(email,token)
    }

    async recoverPassword(newPassword, token) {
        const user = await this.userDao.findByRecoverPasswordToken(token)
        if(!user) {
            CustomError.createError({
                name:"User not found",
                cause: 'not found',
                message: "Error token not found",
                code: EErrors.NOT_FOUND
            })
        }

        const newHashedPassword = createHash(newPassword);
        if(isValidPassword(user.password, newHashedPassword)) {
            CustomError.createError({
                name:"Invalid Password",
                cause: 'same password',
                message: "Invalid password: use a new password",
                code: EErrors.GENERIC_ERROR
            })
        }
        const expirationDate = user.recoverPasswordExpirationDate?.getTime()
        if (expirationDate <= Date.now()) {
            CustomError.createError({
                name:"Expirate token",
                cause: 'Recover token expired',
                message: "Time is up, the token has expired",
                code: EErrors.RECOVER_TOKEN_EXPIRED
            })
        }
        await this.userDao.updatePassword(user._id, newHashedPassword)
    }


}