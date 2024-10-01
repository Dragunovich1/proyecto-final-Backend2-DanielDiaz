// app.js
require('dotenv').config();  // Cargar el archivo .env
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const { getProductsForView } = require('./controllers/productController');
const handlebarsHelpers = require('./handlebarsHelpers'); // Importar los helpers de Handlebars
const cookieParser = require('cookie-parser');
const passport = require('passport'); // Esto está bien
require('./config/passport'); // Luego carga la configuración de passport, pero no lo reasignes
const User = require('./models/User'); // Importar modelo de usuario para /manage-users

const app = express();
const server = http.createServer(app);
const io = socketIo(server);




// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/base_de_datos', {
    serverSelectionTimeoutMS: 30000,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Configuración de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: handlebarsHelpers, // Registrar los helpers de Handlebars
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configurar middleware de sesión
app.use(session({
    secret: '7ae24cf711c0927e7b786016f6bddb1c39fd626d',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Middleware para manejar WebSockets
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Middleware para manejar PUT y DELETE desde formularios
app.use(methodOverride('_method'));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// Ruta para vista index.handlebars
app.get('/', getProductsForView);

// Ruta para vista realTimeProducts.handlebars
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { title: 'Agregar/modificar/eliminar productos', products, showDashboardLink: true });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

// Ruta para vista carts.handlebars
app.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        res.render('carts', { title: 'Carrito', cart, cartId: req.session.cartId, showDashboardLink: true });
    } catch (error) {
        res.status(500).send('Error al obtener el carrito');
    }
});

// Ruta para vista product.handlebars
app.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (product) {
            res.render('product', { product, cartId: req.session.cartId, showDashboardLink: true });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para vista confirmation.handlebars
app.get('/carts/:cid/product/:pid/confirmation', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        const product = await Product.findById(req.params.pid);

        res.render('confirmation', { title: 'Confirmacion de producto agregado', cart, product, showDashboardLink: true });
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});

// Nueva ruta para vista de edición
app.get('/products/:pid/edit', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (product) {
            res.render('editProduct', { title: 'Modificar Producto', product, showDashboardLink: true });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para login
app.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar Sesión', showDashboardLink: true });
});

// Ruta para registrarse
app.get('/register', (req, res) => {
    res.render('register', { title: 'Registrarse', showDashboardLink: true });
});

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
