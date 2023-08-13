import express from 'express';
import CartController from '../controllers/cart.controller.js';
import passport from 'passport';
import { cartOwnerMiddleWare } from './middlewares/roles.middelware.js';

const router = express.Router();

const cartController = new CartController();

router.post('/', async (req, res) => {
  try {
    const cart = await cartController.createCart()
    res.send(cart);
  }
  catch (e) {
    res.status(400).send({error: e.message})
  }
})

router.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  let cart = await cartController.getCartById(cid)

  if (!cart) {
    res.send("No se encontró el carrito")
  }
  res.send(cart.products)
})

router.post('/:cid/product/:pid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    console.log('before add')
    await cartController.addProductToCart(cid, pid)
    console.log('after add')
    const cart = await cartController.getCartById(cid)
    console.log('after get')
    res.send(cart)
  } catch (e) {
    res.status(404).send({error: e.message})
  }
})

router.get('/', async(req, res) => {
  const carts = await cartController.getAllCarts()

  if (!carts) {
    res.send('Carts not found')
  }
  res.send(carts)
})

router.delete('/:cid/products/:pid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartController.deleteProductFromCart(cid, pid);
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.delete('/:cid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res) => {
  const cid = req.params.cid;

  try {
    await cartController.deleteAllProductsFromCart(cid);
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.put('/:cid/products/:pid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await cartController.addProductToCart(cid, pid, quantity)
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.put('/:cid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res) => {
  const cid = req.params.cid;
  const productos = req.body;

  try {
    await cartController.updateCart(cid, productos)
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }

})

router.post('/:cid/purchase', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res) => {
  try {
 const missingProducts = await cartController.processPurchase(req.params.cid, req.session.user)
  res.send({ status: "success" , missingProducts})}
 catch(e) {
    res.status(400).send({error: e.message})
  }
})

export default router;