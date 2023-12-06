import express from 'express';
import __dirname from './utils.js';
import { ProductRouter } from './routes/products.router.js';
import { CartRouter } from './routes/carts.router.js';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import ProductManager from './managers/ProductManager.js';

const PORT = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => {
    console.log(`express localhost: ${PORT}`)
});

const socketServer = new Server(httpServer);

app.engine("handlebars",engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));

app.use("/", viewsRouter);
app.use("/realtimeproducts", viewsRouter)
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);

socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado con ID:",socket.id);

    socket.on('addProduct', async (productData) => {
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);

            const productManager = new ProductManager('products.json');
            await productManager.initializeId();
            await productManager.addProduct(productData.title, productData.description, productData.price, productData.thumbnails, productData.code, productData.stock);

            // Emite el evento 'newProduct' a todos los clientes conectados para actualizar la lista en tiempo real
            socketServer.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
});