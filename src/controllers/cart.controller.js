import CartService from "../services/cart.service.js";

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
            return {
                error: 'debes especificar un id',
            }
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
            return {
                error: 'debes especificar un cart id',
            }
        }

        if(!pid) {
            return {
                error: 'debes especificar un product id',
            }
        }
        await this.cartService.addProductToCart(cid,pid);
    }

    async deleteProductFromCart(cid, pid) {
        if(!cid) {
            return {
                error: 'debes especificar un cart id',
            }
        }

        if(!pid) {
            return {
                error: 'debes especificar un product id',
            }
        }
        await this.cartService.deleteProductFromCart(cid, pid)
    }

    async deleteAllProductsFromCart(cid) {
        if(!cid) {
            return {
                error: 'debes especificar un cart id',
            }
        }

        await this.cartService.deleteAllProductsFromCart(cid)
    }

    async updateCart(cid, productos) {
        if(!cid) {
            return {
                error: 'debes especificar un cart id',
            }
        }
        if (productos.length === 0) {
            return {
                error: 'No hay productos'
            }
        }

        await this.cartService.updateCart(cid, productos);
    }

    async processPurchase(cid, user) {
        return this.cartService.processPurchase(cid, user)
    }
}