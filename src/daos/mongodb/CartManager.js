import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.js";

export default class CartManager {
  connection = mongoose.connect("mongodb+srv://admin:admin123@cluster0.wnbmalb.mongodb.net/ecommerce?retryWrites=true&w=majority");
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

  async addProductToCart(cid, pid) {
    await this.productManager.getProductById(pid);
    const cart = await this.getCartById(cid);
    const cartProduct = cart.products.find(p => {
      return p.product._id.toString() === pid
    })

    if (cartProduct) {
      cart.products = cart.products.filter(producto => {
        return  producto.product._id.toString() !== pid
      })
      cart.products.push({product: pid, quantity: cartProduct.quantity + 1})
    } else {
      cart.products.push({ product: pid, quantity: 1});
    }

    await cart.save()
    return;
  }
}