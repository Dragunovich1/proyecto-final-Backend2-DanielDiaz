const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createCart = async (req, res) => {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
};

const getCartById = async (req, res) => {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.json(cart);
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        const product = await Product.findById(pid);

        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        // Redirigir a la vista de confirmación
        res.redirect(`/carts/${cid}/product/${pid}/confirmation`);
    } catch (error) {
        res.status(500).send('Error al agregar el producto al carrito');
    }
};


const deleteProductFromCart = async (req, res) => {
    const cart = await Cart.findById(req.params.cid);
    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);
    await cart.save();
    res.json(cart);
};

const updateCart = async (req, res) => {
    const cart = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true }).populate('products.product');
    res.json(cart);
};

const updateProductQuantityInCart = async (req, res) => {
    const cart = await Cart.findById(req.params.cid);
    const { pid } = req.params;
    const product = cart.products.find(p => p.product.toString() === pid);
    if (product) {
        product.quantity = req.body.quantity;
        await cart.save();
        res.json(cart);
    } else {
        res.status(404).send('Product not found in cart');
    }
};

const deleteAllProductsFromCart = async (req, res) => {
    const cart = await Cart.findById(req.params.cid);
    cart.products = [];
    await cart.save();
    res.json(cart);
};

const updateProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid).populate('products.product');
        const productInCart = cart.products.find(p => p.product._id.toString() === pid);

        if (productInCart) {
            productInCart.quantity = Math.max(1, Math.min(quantity, productInCart.product.stock)); // Asegurar límites
            await cart.save();
        }

        res.redirect(`/carts/${cid}`);
    } catch (error) {
        res.status(500).send('Error al actualizar el producto en el carrito');
    }
};

const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        cart.products = cart.products.filter(p => p.product.toString() !== pid);

        await cart.save();
        res.redirect(`/carts/${cid}`);
    } catch (error) {
        res.status(500).send('Error al eliminar el producto del carrito');
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantityInCart,
    deleteAllProductsFromCart,
    updateProductInCart,
    removeProductFromCart
};
