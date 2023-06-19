import mongoose from 'mongoose';
import { productsModel } from './models/products.model.js';

export default class ProductManager {
  connection = mongoose.connect("mongodb+srv://admin:admin123@cluster0.wnbmalb.mongodb.net/ecommerce?retryWrites=true&w=majority")

  async addProduct(product) {
    let result = await productsModel.create(product);
    return result
  }

  async getProducts() {
    let result = await productsModel.find().lean();
    return result
  }

  async getProductById(id) {
    let result = await productsModel.findOne({ _id: id });
    if (result) {
      return result
    } else {
      throw new Error("product not found")
    }
  }

  async updateProduct(id, updatedProduct) {
    let result = await productsModel.updateOne(
      {_id: id},
      { $set: updatedProduct }
    );
    return result
  }

  async deleteProduct(id) {
    let result = await productsModel.deleteOne({_id: id})
    return result
  }
}
