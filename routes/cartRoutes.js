const express = require('express');
const router = express.Router();
const { updateProductInCart, removeProductFromCart } = require('../controllers/cartController');
const {
    createCart,
    getCartById,
    addProductToCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantityInCart,
    deleteAllProductsFromCart
} = require('../controllers/cartController');

router.post('/', createCart);
router.get('/:cid', getCartById);
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductQuantityInCart);
router.delete('/:cid', deleteAllProductsFromCart);
router.put('/:cid/product/:pid', updateProductInCart);
router.delete('/:cid/product/:pid', removeProductFromCart);

module.exports = router;
