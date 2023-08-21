import { CustomError } from '../../services/errors/CustomError.js';
import EErrors from '../../services/errors/enums.js';
import { generateProductNotFoundInfo } from '../../services/errors/info.js';
import { productsModel } from './models/products.model.js';

export default class ProductDAO {
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
      CustomError.createError({
        name:"Product fetch error",
        cause: generateProductNotFoundInfo(id),
        message: "Product not found",
        code: EErrors.NOT_FOUND
      })
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
