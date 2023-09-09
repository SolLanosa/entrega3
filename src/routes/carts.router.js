import express from 'express';
import CartController from '../controllers/cart.controller.js';
import passport from 'passport';
import { cartOwnerMiddleWare } from './middlewares/roles.middelware.js';

const router = express.Router();

const cartController = new CartController();

router.post('/', async (req, res, next) => {
  try {
    const cart = await cartController.createCart()
    res.send(cart);
  }
  catch (e) {
    next(e)
  }
})

router.get('/:cid', async (req, res, next) => {
  const cid = req.params.cid;
  try {
    let cart = await cartController.getCartById(cid)
    res.send(cart.products)
  } catch (e) {
    next(e)
  }
})

router.post('/:cid/product/:pid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res, next) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartController.addProductToCart(cid, pid, req.session.user)
    const cart = await cartController.getCartById(cid)
    res.send(cart)
  } catch (e) {
    next(e)
  }
})

router.get('/', async(req, res) => {
  const carts = await cartController.getAllCarts()

  if (!carts) {
    res.send('Carts not found')
  }
  res.send(carts)
})

router.delete('/:cid/products/:pid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res, next) => {
  const cid = req.params.cid;
  const pid = req.params.pid;

  try {
    await cartController.deleteProductFromCart(cid, pid);
    res.send({ status: "success" });
  } catch(e) {
    next(e)
  }
})

router.delete('/:cid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res, next) => {
  const cid = req.params.cid;

  try {
    await cartController.deleteAllProductsFromCart(cid);
    res.send({ status: "success" });
  } catch(e) {
    next(e)
  }
})

router.put('/:cid/products/:pid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res, next) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;

  try {
    await cartController.addProductToCart(cid, pid, quantity)
    res.send({ status: "success" });
  } catch(e) {
    next(e)
  }
})

router.put('/:cid', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res, next) => {
  const cid = req.params.cid;
  const productos = req.body;

  try {
    await cartController.updateCart(cid, productos)
    res.send({ status: "success" });
  } catch(e) {
    next(e)
  }

})

router.post('/:cid/purchase', passport.authenticate('session'), cartOwnerMiddleWare, async (req, res, next) => {
  try {
 const missingProducts = await cartController.processPurchase(req.params.cid, req.session.user)
  res.send({ status: "success" , missingProducts})}
 catch(e) {
    next(e)
  }
})

export default router;