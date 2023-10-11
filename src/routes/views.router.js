import express from 'express';
import ProductManager from '../daos/mongodb/ProductDAO.js';
import UserDAO from '../daos/mongodb/UserDAO.js';
import CartDAO from '../daos/mongodb/CartDAO.js';
import { rolesMiddleWareAdmin } from './middlewares/roles.middelware.js';
import passport from 'passport';
const router = express.Router();
const productManager = new ProductManager();
const userManager = new UserDAO()
const cartManager = new CartDAO();

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
    cart: cid,
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

router.get('/recoverPassword', (req,res) => {
  res.render('recoverPassword')
})


router.get('/user/uploadDocuments', (req,res) => {
  const user = req.session.user;
  res.render('uploadDocuments', {
    user
  })
})


router.get('/user', passport.authenticate('session'), rolesMiddleWareAdmin, async (req,res) => {
  let page = Number(req.query.page)  || 1;
  const users = await userManager.getUsers(10, page)
  
  res.render('userAdmin', {
    prev: users.prevPage,
    next: users.nextPage,
    page: users.page,
    totalPages: users.totalPages,
    users: JSON.parse(JSON.stringify(users.docs)),
    style: 'userAdmin.css'
  })
})


export default router;
