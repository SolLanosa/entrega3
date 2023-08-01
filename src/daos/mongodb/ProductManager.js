import mongoose from 'mongoose';
import { productsModel } from './models/products.model.js';

export default class ProductManager {
  connection = mongoose.connect(process.env.MONGO_URL)

  async addProduct(product) {
    let result = await productsModel.create(product);
    return result
  }

  async getProducts(limit = 10, page = 1, sort=0, filtro='', filtroVal='') {
    let whereOptions = {}
    if (filtro != '' && filtroVal != '') {
      whereOptions = { [filtro] : filtroVal}
    }

    let result = await productsModel.paginate(
      whereOptions,
      {
        whereOptions,
        limit: limit,
        page: page,
        sort: { price: sort }
      });
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
