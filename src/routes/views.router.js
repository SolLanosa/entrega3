import express from 'express';
import ProductManager from '../daos/mongodb/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager()

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css'
  })
})

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()

  res.render('index', {
    products
  })
})

export default router;
