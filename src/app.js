import express from "express";
import 'dotenv/config.js'
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import routerProducts from "./routes/products.router.js";
import routerCarts from './routes/carts.router.js';
import routerUser from './routes/user.router.js'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import MongoStore from "connect-mongo";
import session from "express-session"
import ProductManager from "./daos/mongodb/ProductDAO.js"
import MessageManager from "./daos/mongodb/MessageManager.js";
import mongoose from "mongoose";
import sessionRouter from './routes/session.router.js'
import mockingRouter from './routes/mocking.router.js'
import passport from 'passport'
import { initializePassport } from "./config/passport.config.js"
import { CONFIG } from './config.js'
import { errorMiddleware } from "./services/middlewares/error.middleware.js";
import { LEVELS, addLogerMiddelware } from "./logger.config.js";

const connection = mongoose.connect(
  CONFIG.MONGO_URL
);

const productManager = new ProductManager()
const messageManager = new MessageManager()

const app = express();

const httpServer = app.listen(8080, () => {
  console.log("servidor levantado");
});

const socketServer = new Server(httpServer);
socketServer.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado ' + socket.id)
  const products = await productManager.getProducts()
  const messages = await messageManager.getMessages()
  //server emite productos
  socket.emit('products', products)
  socket.emit('messages', messages)

  socket.on("message", (data) => {
    messageManager.addMessage(data);
    socketServer.emit("imprimir", data);
  });

  socket.on('authenticatedUser', (data) => {
    socket.broadcast.emit('newUserAlert', data)
  })
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

initializePassport()
app.use(session({
  store: new MongoStore({
    mongoUrl: CONFIG.MONGO_URL,
  }),
  secret: 'mongoSecret',
  resave: true,
  saveUninitialized: false,
}))

app.use(addLogerMiddelware);
app.get('/api/loggerTest', (req, res) => {

  const {level, message} =  req.body;
  if(!LEVELS.includes(level)) {
    return res.status(400).send({error: "invalid level"})
  }
  req.logger[level](message)
  
  res.send({message: "Prueba de loggger", log: {level, message}})
})

app.use(passport.initialize())
app.use("/", viewsRouter)
app.use("/api/products/", routerProducts)
app.use("/api/carts/", routerCarts)
app.use("/api/chat", viewsRouter)
app.use("/api/sessions", sessionRouter)
app.use("/api/users", routerUser)
app.use("/mockingproducts", mockingRouter)
app.use(errorMiddleware)
