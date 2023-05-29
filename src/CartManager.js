import fs from 'fs';
import ProductManager from '../src/ProductManager.js';


export default class CartManager {
  constructor(path) {
    this.path = path;
    this.productManager = new ProductManager('./products.json')
  }

  getCartsFile() {
    if (fs.existsSync(this.path)) {
      const file = fs.readFileSync(this.path)
      const cartFile = JSON.parse(file);
      return cartFile;
    }

    return {
      lastId: 1,
      carts: [],
    };
  }


  addCart() {
    const lastId = this.getCartsFile().lastId;
    const newCart = {
      id: lastId,
      products: []
    }
    const carts = this.getCartsFile().carts;
    carts.push(newCart);
    fs.writeFileSync(this.path, JSON.stringify({ lastId: lastId + 1, carts }));
    return newCart
  }

  getCartById(id) {
    const productsSelected = this.getCartsFile().carts.find((p) => p.id === id);
    if (productsSelected) {
      return productsSelected
    } else {
      throw new Error('Cart not found')
    }
  }

  addProductToCart(cid, pid) {
      this.productManager.getProductById(pid)
      const lastId = this.getCartsFile().lastId;
      const carts = this.getCartsFile().carts;
      const cartSelected = this.getCartById(cid)
      let product = cartSelected.products.find((p) => p.product === pid)
      if (product) {
        const updatedProducts = cartSelected.products.filter(p => p.product !== pid);
        updatedProducts.push({ ...product, quantity: product.quantity + 1 })
        cartSelected.products = updatedProducts
      } else {
        product = {
          product: pid,
          quantity: 1
        }
        cartSelected.products.push(product)
      }
      const updatedCarts = carts.filter(cart => cart.id !== cartSelected.id)
      updatedCarts.push(cartSelected)
      fs.writeFileSync(this.path, JSON.stringify({lastId, carts:updatedCarts}));
  }
}