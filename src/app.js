import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import routerProducts from "./routes/products.router.js";
import routerCarts from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager('./products.json')
const app = express();
const httpServer = app.listen(8080, () => {
  console.log("servidor levantado");
});

const socketServer = new Server(httpServer);

socketServer.on('connection', socket => {
  console.log('Nuevo cliente conectado ' + socket.id)

  const products = productManager.getProducts()
  //server emite productos
  socket.emit('products', products)

  //server escucha que se elimino un producto
  socket.on('deleteProduct', id => {
    productManager.deleteProduct(id)
    //server emite que se ha elmininado un producto
    socketServer.emit('productDeleted', id)
  })

  socket.on('addProduct', producto => {
    const newProduct = productManager.addProduct(producto)
    socketServer.emit('productAdded', newProduct)
  })

})

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products/", routerProducts)
app.use("/api/carts/", routerCarts)
app.use("/", viewsRouter)
