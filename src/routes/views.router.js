import express from 'express';
import ProductManager from '../daos/mongodb/ProductManager.js';
import CartManager from '../daos/mongodb/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/realtimeproducts', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login')
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css'
  })
})

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  const user = req.session.user;
  if (!user) return res.redirect('/login')
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
  const user = req.session.user;
  if (!user) return res.redirect('/login')
  res.render('products', {
    products: JSON.parse(JSON.stringify(products.docs)),
    prev: products.prevPage,
    next: products.nextPage,
    page: products.page,
    totalPages: products.totalPages,
    user,
    style: 'products.css',
  })
})

router.get('/products/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = await productManager.getProductById(pid);
  const user = req.session.user;


  if (!user) return res.redirect('/login')
  res.render('product', {
    product: JSON.parse(JSON.stringify(product)),
    user,
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

router.get('/register', (req, res) => {
  res.render('register');
})

router.get('/login', (req, res) => {
  res.render('login');
})

router.get('/restartPassword',(req,res)=>{
  res.render('restartPassword');
})

export default router;
