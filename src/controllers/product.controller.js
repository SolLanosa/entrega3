import { CustomError } from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateMissingId, generateProductCreateErrorInfo } from "../services/errors/info.js";
import ProductService from "../services/products.service.js";

export default class ProductController {
    constructor() {
        this.productService = new ProductService()
    }

    async createProduct(product){
        if (!product.title || !product.description || !product.code || !product.category || !product.price || !product.thumbnails || !product.stock || !product.status){
            CustomError.createError({
              name: "Product creation error",
              cause: generateProductCreateErrorInfo(product),
              message: "error trying to create product",
              code: EErrors.INVALID_TYPES_ERROR,
          })
        }
        const result = await this.productService.createProduct(product)
        return result
    }

    async getProducts(req) {
        let limit = Number(req.query.limit) || 10;
        let page = Number(req.query.page)  || 1;
        let sort = Number(req.query.sort)  || 0;
        let filtro = req.query.filtro || '';
        let filtroVal = req.query.filtroVal || '';
      
        const result = await this.productService.getProducts(limit, page, sort, filtro, filtroVal);
        return result
    }

    async getProductById(id) {
       if(!id) {
        CustomError.createError({
            name: "Missing id",
            cause: generateMissingId(id),
            message: "Error trying to get product by id because id is missing",
            code: EErrors.NOT_FOUND,
        })
       } 
        const result = await this.productService.getProductById(id);
        return result
    }

    async updateProduct(id, updatedProduct) {
        if(!id) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Error trying to update product because id is missing",
                code: EErrors.NOT_FOUND,
            })
        } 
        const result = await this.productService.updateProduct(id, updatedProduct);
        return result
      }
    
      async deleteProduct(id) {
        if(!id) {
            CustomError.createError({
                name: "Missing id",
                cause: generateMissingId(id),
                message: "Error trying to delete product because id is missing",
                code: EErrors.NOT_FOUND,
            })
        }
        const result = await this.productService.deleteProduct(id)
        return result
      }
}