import CartService from "./cart.service.js";
import { createHash, isValidPassword } from '../utils.js';
import UserDao from '../daos/mongodb/UserDAO.js'
import { CONFIG } from "../config.js";
import { generateUserErrorInfo } from "./errors/info.js";
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
        if (!isValidPassword(user, password)) return null
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
                password: ''
            }
            const savedUser = await this.userDao.createUser(newUser);
            return savedUser;
        } 
        return null
    }

    async restartPassword(email, password) {
        const user = await this.userDao.findByEmail(email);
        if(!user) return null
        const newHashedPassword = createHash(password);
        await this.userDao.updatePassword(user._id, newHashedPassword)
    }
}