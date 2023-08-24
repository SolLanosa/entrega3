import CartService from "../services/cart.service.js";
import { CustomError } from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateMissingId, productsNotExistError } from "../services/errors/info.js";

export default class CartController {
    constructor(){
        this.cartService = new CartService();
    }

    async createCart() {
        const result = await this.cartService.createCart();
        return result
    }

    async getCartById(id){
        if(!id) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Error trying to get cart by id because id is missing",
                code: EErrors.NOT_FOUND,
            })
        }
        const result = await this.cartService.getCartById(id);
        return result
    }

    async getAllCarts() {
        const result = await this.cartService.getAllCarts() 
        return result
    }

    async addProductToCart(cid, pid) {
        if(!cid) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Error trying to get cart by id because id is missing",
                code: EErrors.NOT_FOUND,
            })
        }

        if(!pid) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Product id is missing",
                code: EErrors.NOT_FOUND,
            })
        }
        await this.cartService.addProductToCart(cid,pid);
    }

    async deleteProductFromCart(cid, pid) {
        if(!cid) {
           CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Error trying to get cart by id because id is missing",
                code: EErrors.NOT_FOUND,
            })
        }

        if(!pid) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Product id is missing",
                code: EErrors.NOT_FOUND,
            })
        }
        await this.cartService.deleteProductFromCart(cid, pid)
    }

    async deleteAllProductsFromCart(cid) {
        if(!cid) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Error trying to get cart by id because id is missing",
                code: EErrors.NOT_FOUND,
            })
        }

        await this.cartService.deleteAllProductsFromCart(cid)
    }

    async updateCart(cid, productos) {
        if(!cid) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Error trying to get cart by id because id is missing",
                code: EErrors.NOT_FOUND,
            })
        }
        if (productos.length === 0) {
            CustomError.createError({
                name: "Missing products",
                cause: productsNotExistError(),
                message: "Error trying to update cart by id because there is no products",
                code: EErrors.NOT_FOUND,
            })
        }

        await this.cartService.updateCart(cid, productos);
    }

    async processPurchase(cid, user) {
        return this.cartService.processPurchase(cid, user)
    }
}