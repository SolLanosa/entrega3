import ProductService from "../services/products.service.js";

export default class ProductController {
    constructor() {
        this.productService = new ProductService()
    }


    async createProduct(product){
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
        return {
            error:'id vacio'
        }
       } 
        const result = await this.productService.getProductById(id);

        return result
    }

    async updateProduct(id, updatedProduct) {
        if(!id) {
            return {
                error:'id vacio'
            }
        } 
        const result = await this.productService.updateProduct(id, updatedProduct);
        return result
      }
    
      async deleteProduct(id) {
        if(!id) {
            return {
                error:'id vacio'
            }
        }
        const result = await this.productService.deleteProduct(id)
        return result
      }
}