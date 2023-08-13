import CartRepository from "../repositories/cart.repositories.js";
import ProductService from './products.service.js'
import TicketService from './ticket.service.js'

export default class CartService {
    constructor(){
        this.cartRepository = new CartRepository(); 
        this.productService = new ProductService()
        this.ticketService = new TicketService()
    }

    async createCart() {
        const result = await this.cartRepository.createCart()
        return result
    }

    async getCartById(id) {
        const result = await this.cartRepository.getCartById(id);     
        if(!result) {
            throw new Error('el cart no exite')
        }
        return result
    }

    async getAllCarts() {
        const result = await this.cartRepository.getAllCarts()
        return result
    }

    async addProductToCart(cid, pid){
        const product = await this.productService.getProductById(pid);
        const cart = await this.getCartById(cid)
        await this.cartRepository.addProductToCart(cart._id.toString(), product._id.toString());
    }

    async deleteProductFromCart(cid, pid) {
        const product = await this.productService.getProductById(pid);
        const cart = await this.getCartById(cid)
        if(!cart.products.find(p => p.product._id === pid)) {
            throw new Error('el producto no exite en el carrito')
        }
        await this.cartRepository.deleteProductFromCart(cart._id.toString(), product._id.toString());
    }

    async deleteAllProductsFromCart(cid) {
        const cart = await this.getCartById(cid)
        if(!cart.products.length === 0) {
            throw new Error('el carrito esta vacio no hay nada para eliminar')
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