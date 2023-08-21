import { CustomError } from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import { generateCartNotFoundInfo, generateErrorProductNotBeDelete } from "../../services/errors/info.js";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductDAO.js";

export default class CartDAO {
  productManager = new ProductManager()

  async createCart() {
    const result = await cartModel.create({ products: [] });
    return result
  }

  async getCartById(id) {
    const result = await cartModel.findOne({ _id: id }).populate('products.product');
    return result
  }

  async getAllCarts() {
    const result = await cartModel.find();
    return result
  }

  async addProductToCart(cid, pid, quantity = 1) {
    await this.productManager.getProductById(pid);
    const cart = await this.getCartById(cid);
    const cartProduct = cart.products.find(p => {
      return p.product._id.toString() === pid
    })
    if (cartProduct) {
      cart.products = cart.products.filter(producto => {
        return  producto.product._id.toString() !== pid
      })
      cart.products.push({product: pid, quantity: cartProduct.quantity + quantity})
    } else {
      cart.products.push({ product: pid, quantity: 1});
    }

    await cart.save()
  }

  async deleteProductFromCart(cid, pid) {
    const product = await this.productManager.getProductById(pid);
    const cart = await this.getCartById(cid);

    if (!cart) {
      CustomError.createError({
        name:"Cart fetch error",
        cause: generateCartNotFoundInfo(id),
        message: "Cart not found",
        code: EErrors.NOT_FOUND
      })
    }

    const proudctInCart = cart.products.find(p => {
      return p.product._id.toString() === pid
    })

    if (!proudctInCart) {
      throw new Error("You can't delete this products. Product have not been add to cart")
    }

    if (product) {
      cart.products = cart.products.filter(producto => {
        return producto.product._id.toString() !== pid
      })
    } else {
      CustomError.createError({
        name:"Product fetch error",
        cause: generateErrorProductNotBeDelete(product),
        message: "Product not found",
        code: EErrors.NOT_FOUND
      })
    }

    await cart.save()
  }

  async deleteAllProductsFromCart(cid) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name:"Cart fetch error",
        cause: generateCartNotFoundInfo(id),
        message: "Cart not found",
        code: EErrors.NOT_FOUND
      })
    }
    cart.products = []
    await cart.save()
  }

  async updateCart(cid, productos) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      CustomError.createError({
        name:"Cart fetch error",
        cause: generateCartNotFoundInfo(id),
        message: "Cart not found",
        code: EErrors.NOT_FOUND
      })
    }
    cart.products = productos;
    await cart.save()
  }
}

