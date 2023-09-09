import ProductDao from "../daos/mongodb/ProductDAO.js"
import { CustomError } from "./errors/CustomError.js"
import EErrors from "./errors/enums.js"

export default class ProductService{
    constructor(){
        this.productDao = new ProductDao()
    }

    async createProduct(product, user){
      product.owner = user.role === 'admin' ? undefined : user._id
      const result = await this.productDao.addProduct(product)
      return result
    }

    async getProducts(limit, page, sort, filtro, filtroVal) {
        const result = await this.productDao.getProducts(limit, page, sort, filtro, filtroVal);
        return result
    }

    async getProductById(id){
        const result = await this.productDao.getProductById(id);
        if (!result) {
            return {
                error:'producto no existe'
            }
          }
        return result
    }

    async updateProduct(id, updatedProduct, user) {
      const product = await this.getProductById(id);
      if(user.role !== 'admin' && product.owner.toString() !== user._id.toString()) {
          CustomError.createError({
            name:"Not the owner",
            cause: 'Not the owner',
            message: 'cannot update product you dont own',
            code: EErrors.GENERIC_ERROR
        })
      }
      const result = await  this.productDao.updateProduct(id, updatedProduct);
      return result
    }
  
    async deleteProduct(id, user) {
      const product = await this.getProductById(id);
      if(user.role !== 'admin' && product.owner?.toString() !== user._id.toString()) {
        CustomError.createError({
          name:"Not the owner",
          cause: 'Not the owner',
          message: 'cannot update product you dont own',
          code: EErrors.GENERIC_ERROR
      })
      }
      const result = await this.productDao.deleteProduct(id)
      return result
    }
}