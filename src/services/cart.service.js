import CartRepository from "../repositories/cart.repositories.js";
import ProductService from './products.service.js'
import TicketService from './ticket.service.js'
import { CustomError } from "./errors/CustomError.js"; 
import EErrors from "./errors/enums.js";
import { generateCartNotFoundInfo } from "./errors/info.js";

export default class CartService {
    constructor(){
        this.cartRepository = new CartRepository(); 
        this.productService = new ProductService()
        this.ticketService = new TicketService()
    }

    async createCart() {
        try {
            const result = await this.cartRepository.createCart()
            return result
        } catch(e) {
            CustomError.createError({
                name:"Cart creation error",
                cause: e.message,
                message: "Error trying to create a cart",
                code: EErrors.DATABASE_ERROR
            })
        }
       
    }

    async getCartById(id) {
        const result = await this.cartRepository.getCartById(id);     
        if(!result) {
            CustomError.createError({
                name:"Cart fetch error",
                cause: generateCartNotFoundInfo(id),
                message: "Cart not found",
                code: EErrors.NOT_FOUND
            })
        }
        return result
    }

    async getAllCarts() {
        const result = await this.cartRepository.getAllCarts()
        return result
    }

    async addProductToCart(cid, pid, user){
        const product = await this.productService.getProductById(pid);

        if(user._id.toString() === product.owner?.toString()) {
            CustomError.createError({
                name:"User own the product",
                cause: 'Error',
                message: "You cant add a product you own to your cart",
                code: EErrors.GENERIC_ERROR
            })
        }

        const cart = await this.getCartById(cid)
        await this.cartRepository.addProductToCart(cart._id.toString(), product._id.toString());
    }

    async deleteProductFromCart(cid, pid) {
        const product = await this.productService.getProductById(pid);
        const cart = await this.getCartById(cid)
        if(!cart.products.find(p => p.product._id === pid)) {
            CustomError.createError({
                name:"Cart fetch error",
                cause: 'Error',
                message: "El producto no exite en el carrito",
                code: EErrors.NOT_FOUND
            })
        }
        await this.cartRepository.deleteProductFromCart(cart._id.toString(), product._id.toString());
    }

    async deleteAllProductsFromCart(cid) {
        const cart = await this.getCartById(cid)
        if(!cart.products.length === 0) {
            CustomError.createError({
                name:"Cart fetch error",
                cause: 'Error',
                message: "El carrito esta vacio no hay nada para eliminar",
                code: EErrors.NOT_FOUND
            })
        }
        await this.cartRepository.deleteAllProductsFromCart(cart._id.toString())
    }

    async updateCart(cid, productos) {
        const cart = await this.getCartById(cid)
        await this.cartRepository.updateCart(cart._id.toString(),productos)
    }

    async processPurchase(cid, user) {
        const cart = await this.getCartById(cid)
        const validatedProducts = await Promise.all(cart.products.map(async (p) => {
            if(p.quantity <= p.product.stock) {
                await this.productService.updateProduct(p.product._id,{ stock: p.product.stock - p.quantity })
                return {product: p, enoughStock:true}
            } 
            return {product: p, enoughStock:false}
        }))

        const boughtProducts = validatedProducts.filter(p=> p.enoughStock)
        const missingProducts = validatedProducts.filter(p=> !p.enoughStock)

        this.updateCart(cid, missingProducts.map(p => p.product))
        this.ticketService.createTicket(boughtProducts.map(p => p.product), user.email)
        return missingProducts.map(p=>p.product._id)
    }

 }