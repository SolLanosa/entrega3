import express from 'express';
import ProductManager from '../ProductManager.js';

const productManager = new ProductManager('./products.json')

const router = express.Router();

router.get('/', (req, res) => {
  const products = productManager.getProducts()
  res.send({ products });
})

router.post('/', (req, res) => {
  try {
    const product = req.body;
    productManager.addProduct(product);
    res.send({ status: "success" });
  }
  catch (e) {
    res.status(400).send({error: e.message})
  }
})

router.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  try {
    const product = productManager.getProductById(Number(pid))
    res.send(product)
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const product = req.body;
  productManager.updateProduct(Number(pid), product);
  res.send({ status: "success" });
})

router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  productManager.deleteProduct(Number(pid));
  res.send({ status: "success" });
})

export default router;