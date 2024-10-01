const Product = require('../models/Product');
const Cart = require('../models/Cart');

const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const searchQuery = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

        const products = await Product.paginate(searchQuery, options);

        res.status(200).json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.hasPrevPage ? products.page - 1 : null,
            nextPage: products.hasNextPage ? products.page + 1 : null,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getProductsForView = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
        };

        const searchQuery = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

        const products = await Product.paginate(searchQuery, options);

        // Obtener o crear carrito para el usuario
        let cartId;
        if (!req.session.cartId) {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            req.session.cartId = newCart._id;
            cartId = newCart._id;
        } else {
            cartId = req.session.cartId;
        }

        res.render('index', {
            title: 'Dashboard',
            products: products.docs,
            cartId: cartId, // Proporciona el cartId al contexto de la plantilla
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/products?page=${products.page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/products?page=${products.page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (product) {
            res.render('product', { product });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();

        const products = await Product.find();
        req.io.emit('update-products', products);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });

        const products = await Product.find();
        req.io.emit('update-products', products);

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid);

        const products = await Product.find();
        req.io.emit('update-products', products);

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductsForView,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};
