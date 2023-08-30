import express from 'express';
import {rolesMiddleWareAdmin} from '../routes/middlewares/roles.middelware.js'
import passport from 'passport'
import ProductController from '../controllers/product.controller.js';

const productController = new ProductController()

const router = express.Router();

router.get('/',  async (req, res) => {
  req.logger.http('corriendo GET /products')
  const products = await productController.getProducts(req)
  res.send(products);
})

router.post('/', passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res,next)  => {
  req.logger.http('corriendo POST /products')
  try {
    const product = req.body;
    const newProduct = await productController.createProduct(product);
    req.socketServer.sockets.emit('productAdded', newProduct )
    
    res.send({ status: "success" });
  }
  catch (e) {
    next(e)
  }
})

router.get('/:pid', async (req, res, next) => {
  req.logger.http('corriendo GET /products/id')
  const pid = req.params.pid;
  try {
    const product =  await productController.getProductById(pid)
    res.send(product)
  }
  catch(e) {
    next(e)
  }
  
})

router.put('/:pid', passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res, next) => {
  req.logger.http('corriendo PUT /products/id')
  const pid = req.params.pid;
  const product = req.body;
  try {
    await productController.updateProduct(pid, product);
    res.send({ status: "success" });
  } catch(e) {
   next(e)
  }
})

router.delete('/:pid', passport.authenticate('session'), rolesMiddleWareAdmin, async (req, res, next) => {
  req.logger.http('corriendo DELETE /products/id')
  const pid = req.params.pid;
  try {
    await productController.deleteProduct(pid);
    req.socketServer.sockets.emit('productDeleted', pid )
    res.send({ status: "success" });
  } catch(e) {
    next(e)
  }
})

export default router;