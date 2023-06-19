import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import routerProducts from "./routes/products.router.js";
import routerCarts from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import ProductManager from "./daos/mongodb/ProductManager.js"


const productManager = new ProductManager()

const app = express();
const httpServer = app.listen(8080, () => {
  console.log("servidor levantado");
});
const socketServer = new Server(httpServer);
socketServer.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado ' + socket.id)

  const products = productManager.getProducts()
  //server emite productos
  socket.emit('products', await products)
})

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname+'/public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.socketServer = socketServer;
    next()

})

app.use("/", viewsRouter)
app.use("/products/", routerProducts)
app.use("/carts/", routerCarts)

