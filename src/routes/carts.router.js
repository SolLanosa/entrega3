import express from 'express';
import CartManager from '../CartManager.js'

const cartManager = new CartManager('./carrito.json');

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const cart = cartManager.addCart()
    res.send(cart);
  }
  catch (e) {
    res.status(400).send({error: e.message})
  }
})

router.get('/:cid', (req, res) => {
  const cid = req.params.cid;
  try {
    const products = cartManager.getCartById(Number(cid)).products
    res.send(products)
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.post('/:cid/product/:pid', (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    cartManager.addProductToCart(Number(cid), Number(pid))
    const cart = cartManager.getCartById(Number(cid))
    res.send(cart)
  } catch (e) {
    res.status(404).send({error: e.message})
  }
})

export default router;