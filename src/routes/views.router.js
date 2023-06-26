import express from 'express';
import ProductManager from '../daos/mongodb/ProductManager.js';
import CartManager from '../daos/mongodb/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css'
  })
})

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  res.render('index', {
    products: JSON.parse(JSON.stringify(products.docs))
  })
})

router.get('/chat',(req,res)=>{
  res.render('chat');
})

router.get('/products', async (req, res) => {
  let page = Number(req.query.page)  || 1;
  const products = await productManager.getProducts(10, page)
  console.log(products)
  res.render('products', {
    products: JSON.parse(JSON.stringify(products.docs)),
    prev: products.prevPage,
    next: products.nextPage,
    page: products.page,
    totalPages: products.totalPages,
    style: 'products.css'
  })
})

router.get('/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);
  res.render('product', {
    product: JSON.parse(JSON.stringify(product)),
    style: 'product.css'
  })
})


router.get('/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartManager.getCartById(cid)
  const products = cart.products
  res.render('carts', {
    products: JSON.parse(JSON.stringify(products)),
    style: 'carts.css'
  })
})

export default router;
