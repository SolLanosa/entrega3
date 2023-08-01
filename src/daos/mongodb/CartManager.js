import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.js";

export default class CartManager {
  connection = mongoose.connect(process.env.MONGO_URL);
  productManager = new ProductManager()

  async addCart() {
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
    return;
  }

  async deleteProductFromCart(cid, pid) {
    const product = await this.productManager.getProductById(pid);
    const cart = await this.getCartById(cid);

    if (!cart) {
      throw new Error("Cart doesn't exist")
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
      throw new Error("You can't delete this products. Product doesn't exist")
    }

    await cart.save()
    return;
  }

  async deleteAllProductsFromCart(cid) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      throw new Error("Cart doesn't exist")
    }
    cart.products = []
    await cart.save()
    return;
  }

  async updateCart(cid, productos) {
    const cart = await this.getCartById(cid);
    if (!cart) {
      throw new Error("Cart doesn't exist")
    }
    cart.products = productos;
    await cart.save()
    return;
  }
}

