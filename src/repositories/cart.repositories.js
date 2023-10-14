import CartDAO from "../daos/mongodb/CartDAO.js";

// no me parece necesario un repository para este caso, ya que el DAO cumple la funcion. Pero queda de ejemplo
export default class CartRepository {
    constructor() {
        this.cartDao = new CartDAO();
    }

    async createCart() {
        return this.cartDao.createCart()
    }

    async getCartById(id) {
        return this.cartDao.getCartById(id)
    }

    async getAllCarts() {
        return this.cartDao.getAllCarts()
    }

    async addProductToCart(cid, pid, quantity) {
        await this.cartDao.addProductToCart(cid, pid, quantity)
    }

    async deleteProductFromCart(cid, pid) {
        await this.cartDao.deleteProductFromCart(cid, pid)
    }

    async deleteAllProductsFromCart(cid) {
        await this.cartDao.deleteAllProductsFromCart(cid)
    }
    async updateCart(cid, productos) {
        await this.cartDao.updateCart(cid, productos)
    }
}