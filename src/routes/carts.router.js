import express from 'express';
import CartManager from '../daos/mongodb/CartManager.js';

const cartManager = new CartManager();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.addCart()
    res.send(cart);
  }
  catch (e) {
    res.status(400).send({error: e.message})
  }
})

router.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  let cart = await cartManager.getCartById(cid)

  if (!cart) {
    res.send("No se encontró el carrito")
  }
  res.send(cart.products)
})

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartManager.addProductToCart(cid, pid)
    const cart = await cartManager.getCartById(cid)
    res.send(cart)
  } catch (e) {
    res.status(404).send({error: e.message})
  }
})

router.get('/', async(req, res) => {
  const carts = await cartManager.getAllCarts()

  if (!carts) {
    res.send('Carts not found')
  }
  res.send(carts)
})


export default router;