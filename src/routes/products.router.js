import express from 'express';
import {rolesMiddleWareAdmin} from '../routes/middlewares/roles.middelware.js'
import passport from 'passport'
import ProductController from '../controllers/product.controller.js';

const productController = new ProductController()

const router = express.Router();

router.get('/',  async (req, res) => {
  const products = await productController.getProducts(req)
  res.send(products);
})

router.post('/', passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res)  => {
  try {
    const product = req.body;
    const newProduct = await productController.addProduct(product);
    req.socketServer.sockets.emit('productAdded', newProduct )
    
    res.send({ status: "success" });
  }
  catch (e) {
    console.log(e)
    res.status(400).send({error: e.message})
  }
})

router.get('/:pid', async (req, res, next) => {
  const pid = req.params.pid;
  try {
    const product =  await productController.getProductById(pid)
    res.send(product)
  }
  catch(e) {
    next(e)
  }
  
})

router.put('/:pid', passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res) => {
  const pid = req.params.pid;
  const product = req.body;
  try {
    await productController.updateProduct(pid, product);
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.delete('/:pid', passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res) => {
  const pid = req.params.pid;
  try {
    await productController.deleteProduct(pid);
    req.socketServer.sockets.emit('productDeleted', pid )
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

export default router;