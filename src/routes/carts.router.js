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

router.delete('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartManager.deleteProductFromCart(cid, pid);
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.delete('/:cid', async (req, res) => {
  const cid = req.params.cid;

  try {
    await cartManager.deleteAllProductsFromCart(cid);
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.put('/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await cartManager.addProductToCart(cid, pid, quantity)
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.put('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const productos = req.body;

  try {
    await cartManager.updateCart(cid, productos)
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }

})

export default router;