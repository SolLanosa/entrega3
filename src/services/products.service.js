import ProductDao from "../daos/mongodb/ProductDAO.js"

export default class ProductService{
    constructor(){
        this.productDao = new ProductDao()
    }

    async createProduct(product){
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

    async updateProduct(id, updatedProduct) {
      await this.getProductById(id);
      const result = await  this.productDao.updateProduct(id, updatedProduct);
      return result
    }
  
    async deleteProduct(id) {
      await this.getProductById(id);
      const result = await this.productDao.deleteProduct(id)
      return result
    }
}