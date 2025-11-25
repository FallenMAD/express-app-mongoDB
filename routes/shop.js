import express from 'express';

import { shopController } from '../controllers/shop.js';

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);

router.get('/products/:id', shopController.getProductDetails);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cart/delete-product/:id', shopController.deleteCartProduct);
router.get('/orders', shopController.getOrders);
router.post('/create-order', shopController.postOrder);

export default router;
