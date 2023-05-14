import express from 'express';
import ProductManager from './ProductManager.js';

const app = express();

const productManager = new ProductManager('./products.json')

app.get('/products', (req, res) => {
  const products = productManager.getProducts()
  let { limit } = req.query
  if (!limit) return res.send({ products })

  let productsSlice = products.slice(0, Number(limit))
  res.send({products:productsSlice})
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  try {
    const product = productManager.getProductById(Number(id))
    res.send(product) 
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

app.listen(8080);