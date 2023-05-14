import fs from 'fs';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProductsFile() {
    if (fs.existsSync(this.path)) {
      const file = fs.readFileSync(this.path)
      const productsFile = JSON.parse(file);
      return productsFile;
    }

    return {
      products: [],
      lastId: 1
    };
  }

  getProducts() {
    return this.getProductsFile().products
  }

  addProduct(product) {
    const {title, description, price, thumbnail, code, stock, ...rest} = product;

    if (title === undefined ||
        description === undefined ||
        price === undefined ||
        thumbnail === undefined ||
        code === undefined ||
        stock === undefined) {
      throw new Error('Missing required fields');
    }

    if (Object.keys(rest).length !== 0) {
      throw new Error('Invalid fields')
    }

    const lastId = this.getProductsFile().lastId;
    const newProduct = {
      id: lastId,
      ...product
    }
    const products = this.getProducts();
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify({lastId: lastId + 1, products}));
  }

  getProductById(id) {
    const foundProduct = this.getProducts().find((p) => p.id === id);
    if (foundProduct) {
      return foundProduct;
    } else {
      throw new Error('Not found')
    }
  }

  deleteProduct(id) {
    const products = this.getProducts().filter((product => product.id !== id))
    const lastId = this.getProductsFile().lastId;
    fs.writeFileSync(this.path, JSON.stringify({lastId, products}));
  }

  updateProduct(id, partialProduct) {
    if (!Object.keys(partialProduct).every(key => key === 'title' || key === 'description' || key === 'code' || key === 'stock' || key === 'thumbnail' || key === 'price')) {
      throw new Error('Invalid fields')
    }

    const products = this.getProducts().map(product => product.id === id ? { ...product, ...partialProduct} : product);
    const lastId = this.getProductsFile().lastId;
    fs.writeFileSync(this.path, JSON.stringify({lastId, products}));
  }
}
