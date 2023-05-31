import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('./products.json')

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts')
})

router.get('/products', (req, res) => {
  const products = productManager.getProducts()
  res.render('index', {
    products
  })
})

export default router;
