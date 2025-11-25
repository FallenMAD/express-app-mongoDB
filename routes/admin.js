import express from 'express';
import { adminController } from '../controllers/admin.js';

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

router.get('/list-product', adminController.getProducts);

router.get('/edit-product/:id', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product/:id', adminController.deleteProduct);

export default router;
