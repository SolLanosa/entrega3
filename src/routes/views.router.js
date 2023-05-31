import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('./products.json')

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css'
  })
})

router.get('/', (req, res) => {
  const products = productManager.getProducts()
  res.render('index', {
    products
  })
})

export default router;
