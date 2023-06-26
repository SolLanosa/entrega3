import express from 'express';
import ProductManager from '../daos/mongodb/ProductManager.js';

const productManager = new ProductManager()

const router = express.Router();

router.get('/', async (req, res) => {
  let limit = Number(req.query.limit) || 10;
  let page = Number(req.query.page)  || 1;
  let sort = Number(req.query.sort)  || 0;
  let filtro = req.query.filtro || '';
  let filtroVal = req.query.filtroVal || '';

  const products = await productManager.getProducts(limit, page, sort, filtro, filtroVal)
  res.send(products);
})

router.post('/', async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productManager.addProduct(product);
    req.socketServer.sockets.emit('productAdded', newProduct )
    res.send({ status: "success" });
  }
  catch (e) {
    console.log(e)
    res.status(400).send({error: e.message})
  }
})

router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product =  await productManager.getProductById(pid)
    res.send(product)
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.put('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const product = req.body;
  try {
    await productManager.updateProduct(pid, product);
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

router.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    await productManager.deleteProduct(pid);
    req.socketServer.sockets.emit('productDeleted', pid )
    res.send({ status: "success" });
  } catch(e) {
    res.status(404).send({error: e.message})
  }
})

export default router;